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
          "currency": "Country specific currency symbol and code (e.g. ₹ INR)",
          "estimated_budget": "Total estimated cost per person in local currency (low-mid range, numeric value only, e.g. 7500)",
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
