import OpenAI from 'openai';
import { createClient } from 'pexels';
import dotenv from 'dotenv';
import { BlogPost } from '../models/BlogPost';
import { BlogKeyword } from '../models/BlogKeyword';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pexelsClient = createClient(process.env.PEXELS_API_KEY || '');

export async function generateBlogContent(keyword: string) {
  try {
    const prompt = `
      Create a complete, SEO-optimized travel blog post for the keyword: "${keyword}".
      The target audience is travelers looking for weekend getaways and travel guides in India.
      The article should be between 1200 and 2000 words.

      Provide the response in the following JSON format:
      {
        "title": "A catchy, SEO-optimized H1 title",
        "metaTitle": "SEO meta title (max 60 characters)",
        "metaDescription": "Compelling meta description (max 160 characters)",
        "introduction": "A captivating intro paragraph",
        "sections": [
          {
            "heading": "H2 Heading",
            "content": "Detailed paragraphs for this section",
            "subsections": [
              {
                "heading": "H3 Heading",
                "content": "Specific details"
              }
            ]
          }
        ],
        "travel_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
        "faqs": [
          {
            "question": "Relevant FAQ question?",
            "answer": "Detailed answer"
          }
        ],
        "conclusion": "A wrap-up closing section",
        "summary": "Short snippet for preview cards",
        "image_queries": {
          "hero": "A specific query for the hero image (e.g. 'Manali snowy mountains')",
          "inline": ["query 1", "query 2", "query 3"]
        }
      }

      CRITICAL Requirements:
      - Use professional, engaging travel journalism style.
      - Ensure 5-8 major sections with clear headings.
      - Optimization for Google SEO (use relevant LSI keywords).
      - Do NOT include markdown formatting inside JSON values.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error in generateBlogContent:', error);
    throw error;
  }
}

export async function fetchPexelsImages(heroQuery: string, inlineQueries: string[]) {
  try {
    // Fetch Hero Image
    const heroResult = await pexelsClient.photos.search({ query: heroQuery, per_page: 1 });
    const heroUrl = 'photos' in heroResult && heroResult.photos.length > 0 
      ? heroResult.photos[0].src.large2x 
      : 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg'; // Fallback

    // Fetch Inline Images
    const inlineImages = [];
    for (const query of inlineQueries) {
      const result = await pexelsClient.photos.search({ query, per_page: 1 });
      if ('photos' in result && result.photos.length > 0) {
        inlineImages.push({
          url: result.photos[0].src.large,
          alt: query
        });
      }
    }

    return { heroUrl, inlineImages };
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return {
      heroUrl: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg',
      inlineImages: []
    };
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function processManualBlogGeneration(keyword: string) {
  console.log(`Starting manual blog generation for: ${keyword}`);
  
  const content = await generateBlogContent(keyword);
  const { heroUrl, inlineImages } = await fetchPexelsImages(content.image_queries.hero, content.image_queries.inline);
  
  const slug = generateSlug(content.title);

  // Construct HTML content from sections
  let htmlContent = `<p>${content.introduction}</p>`;
  
  content.sections.forEach((section: any, idx: number) => {
    htmlContent += `<h2>${section.heading}</h2>`;
    htmlContent += `<p>${section.content}</p>`;

    // Add an inline image if available after some sections
    if (inlineImages[idx]) {
      htmlContent += `<img src="${inlineImages[idx].url}" alt="${inlineImages[idx].alt}" loading="lazy" />`;
    }

    if (section.subsections) {
      section.subsections.forEach((sub: any) => {
        htmlContent += `<h3>${sub.heading}</h3>`;
        htmlContent += `<p>${sub.content}</p>`;
      });
    }
  });

  htmlContent += `<h2>Travel Tips</h2><ul>`;
  content.travel_tips.forEach((tip: string) => {
    htmlContent += `<li>${tip}</li>`;
  });
  htmlContent += `</ul>`;

  htmlContent += `<h2>Frequently Asked Questions</h2>`;
  content.faqs.forEach((faq: any) => {
    htmlContent += `<div><strong>Q: ${faq.question}</strong><p>${faq.answer}</p></div>`;
  });

  htmlContent += `<h2>Conclusion</h2><p>${content.conclusion}</p>`;

  const newPost = new BlogPost({
    title: content.title,
    slug: slug,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    content: htmlContent,
    heroImage: heroUrl,
    images: inlineImages,
    keyword: keyword,
    publishedDate: new Date()
  });

  await newPost.save();
  return newPost;
}
