import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateItinerary(
  destination: string,
  days: number = 2,
  interests?: string
) {
  try {
    const prompt = `
      Create a detailed ${days}-day weekend trip itinerary for ${destination}.
      ${interests ? `Focus on these interests: ${interests}.` : ''}
      
      Provide the response in the following JSON format:
      {
        "trip_details": {
          "currency": "Country specific currency symbol and code (e.g. ₹ INR)",
          "estimated_budget": "Total estimated cost for the trip in local currency (low-mid range, numeric value only, e.g. 15000)",
          "best_time_to_visit": "Best months to visit (e.g. Oct-Mar)",
          "hotel_suggestions": [
            { "name": "Budget Hotel Name", "tier": "Budget", "price_range": "Price in local currency" },
            { "name": "Mid-range Hotel Name", "tier": "Mid", "price_range": "Price in local currency" },
            { "name": "Luxury Hotel Name", "tier": "Luxury", "price_range": "Price in local currency" }
          ],
          "destination_coordinates": { "lat": 12.34, "lng": 56.78 }
        },
        "destination": "${destination}",
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
