import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateItinerary(
  destination: string,
  days: number = 2,
  interests?: string,
  origin?: string
) {
  try {
    const prompt = `
      Create a detailed ${days}-day weekend trip itinerary for ${destination}.
      ${origin ? `Assume the traveler is starting from ${origin}.` : 'Assume the traveler is starting from a nearby major city.'}
      ${interests ? `Focus on these interests: ${interests}.` : ''}
      
      Provide the response in the following JSON format:
      {
        "trip_details": {
          "currency": "Country specific currency symbol (e.g. ₹, $, €)",
          "estimated_budget": "Total estimated cost per person in local currency (numeric value only, e.g. 7500)",
          "best_time_to_visit": "Best months to visit (e.g. Oct-Mar)",
          "travel_logistics": {
            "bus": "Estimated time from origin (e.g. '6 hours')",
            "train": "Estimated time from origin (e.g. '4 hours')",
            "flight": "Estimated time from origin (e.g. '1.5 hours')",
            "car": "Estimated time from origin (e.g. '5 hours')"
          },
          "hotel_suggestions": [
            { "name": "Budget Hotel Name", "tier": "Budget", "price_range": "Price in local currency" },
            { "name": "Mid-range Hotel Name", "tier": "Mid", "price_range": "Price in local currency" },
            { "name": "Luxury Hotel Name", "tier": "Luxury", "price_range": "Price in local currency" }
          ],
          "destination_coordinates": { "lat": 12.34, "lng": 56.78 }
        },
        "destination": "The specific city or town name for this itinerary (e.g. 'Manali'). If the input was a category like '${destination}', provide the actual place name you selected.",
        "summary": "A brief summary of the trip.",
        "special_events": [
            {
                "name": "Name of the event/festival",
                "date": "When it happens (e.g. 'April', 'Every Sunday', 'Winter')",
                "description": "Short description of what happens.",
                "location": "Where it takes place"
            }
        ],
        "days": [
          {
            "day": 1,
            "title": "Day 1 Title",
            "activities": [
              {
                "time": "Specific time range (e.g., '09:00 AM - 11:00 AM')",
                "description": "Detailed description (2-3 sentences) including what to see and why it's special.",
                "location": "Specific location name",
                "ticket_price": "Approximate price (e.g., '$25', '€15', or 'Free')",
                "image_query": "Keyword for image search (e.g. 'Eiffel Tower', 'Croissant')"
              },
              ...
            ]
          },
          ...
        ]
      }
      
      IMPORTANT:
      - Include "special_events" ONLY if there are notable recurring events, festivals, or markets in ${destination}. If none are famous, leave the array empty.
      - Ensure the JSON is valid and strict. Do not include markdown code blocks.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}

export async function generateSuggestions(location: string) {
  try {
    const prompt = `
      Based on the starting location: "${location}", name 5 best and most popular weekend getaway destinations (towns or cities) that are within 500km distance from ${location}.
      Provide the response as a JSON array of strings only.
      Example: ["Destination 1", "Destination 2", "Destination 3", "Destination 4", "Destination 5"]
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const data = JSON.parse(content);
    // Handle cases where OpenAI might wrap it in an object like { "suggestions": [...] }
    if (Array.isArray(data)) return data;
    if (data.suggestions && Array.isArray(data.suggestions)) return data.suggestions;
    if (data.destinations && Array.isArray(data.destinations)) return data.destinations;

    return Object.values(data)[0] as string[]; // Fallback to first array found
  } catch (error) {
    console.error('Error generating suggestions:', error);
    // Global fallbacks if AI fails
    return ['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini'];
  }
}

export async function updateItinerary(
  currentItinerary: any,
  userRequest: string
) {
  try {
    const prompt = `
      The user wants to modify their weekend trip itinerary for "${currentItinerary.destination}".
      
      User Request: "${userRequest}"
      
      Current Itinerary:
      ${JSON.stringify(currentItinerary, null, 2)}
      
      Update the itinerary based on the user request. You can add, remove, or modify activities, hotel suggestions, or any other details. 
      Maintain the same JSON structure as the current itinerary.
      
      IMPORTANT:
      - Return the FULL updated itinerary as a JSON object.
      - Ensure the JSON is valid and strict. Do not include markdown code blocks.
      - Keep the "destination" field the same.
      - Update "summary" if necessary to reflect the changes.
      - If adding new activities, ensure "image_query" fields are included for them.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    throw error;
  }
}
export async function generateDeepExploreContent(destination: string) {
  try {
    const prompt = `
      Write a comprehensive, SEO-optimized travel guide for "${destination}". 
      The content should be between 1500 to 2000 words.
      
      Structure the guide with a clear HTML hierarchy:
      - <h1>[Destination Name]: The Ultimate Exploration Guide</h1> (At the very beginning)
      - <h2>Introduction</h2>: A captivating overview.
      - <h2>History and Heritage</h2>: Detailed context.
      - <h2>Top Attractions</h2>: At least 5 must-visit spots.
        CRITICAL: Each spot MUST be its own distinct block. Do NOT bunch multiple attractions into a single paragraph.
        Each attraction must follow this exact sequence:
        <h3>[Spot Name]</h3> 
        <p>[Detailed Description]</p>
        <hr />
      - <h2>Gastronomy</h2>: Local delicacies and food culture. (Follow the same <h3> + <p> + <hr /> structure for each dish; NO bunching)
      - <h2>Hidden Gems</h2>: Off-the-beaten-path locations. (Follow the same <h3> + <p> + <hr /> structure; NO bunching)
      - <h2>Practical Information</h2>: Best time to visit, transit, customs.
      - <h2>Conclusion</h2>: A final encouraging wrap-up.
      
      IMPORTANT:
      - Use professional, engaging travel journalism style.
      - Ensure the content is rich in descriptive detail.
      - DO NOT use bold text (e.g. **Name:**) for section titles; ALWAYS use semantic <h3> tags for sub-topics.
      - NEVER bunch distinct sub-topics (like two different attractions) into the same <p> tag. Always start a new block for the next item.
      - Use <hr /> tags between distinct sub-topics (like individual attractions or hidden gems) to provide visual separation.
      - Return the response as a JSON object: { "content": "HTML string here" }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o', // Higher quality for long-form content
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content).content;
  } catch (error) {
    console.error('Error generating deep content:', error);
    throw error;
  }
}
