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
  origin?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const prompt = `
      Create a detailed ${days}-day weekend trip itinerary for ${destination}.
      ${startDate ? `The trip starts on ${startDate}${endDate ? ` and ends on ${endDate}` : ''}. Ensure the activities and suggestions are appropriate for this specific time of year.` : ''}
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

    let content = null;
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
      });
      content = completion.choices[0]?.message?.content;
    } catch (modelErr) {
      console.warn('gpt-4o-mini failed, trying gpt-3.5-turbo fallback...', modelErr);
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: "json_object" },
      });
      content = completion.choices[0]?.message?.content;
    }

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating AI itinerary, constructing structured fallback:', error);
    return buildFallbackItinerary(destination, days, interests, origin);
  }
}

function buildFallbackItinerary(destination: string, days: number = 2, interests?: string, origin?: string) {
    const capitalizedDest = destination.charAt(0).toUpperCase() + destination.slice(1);
    const dayList = [];

    for (let d = 1; d <= days; d++) {
        const title = d === 1 ? `Day 1: Arrival & Exploration in ${capitalizedDest}` 
                    : d === 2 ? `Day 2: Cultural Highlights & Local Delights` 
                    : `Day ${d}: Scenic Spots & Departure`;
        dayList.push({
            day: d,
            title: title,
            activities: [
                {
                    time: "09:00 AM - 11:30 AM",
                    description: `Morning walking tour of ${capitalizedDest}'s central quarters and landmark attractions. Grab local coffee and breakfast nearby.`,
                    location: `${capitalizedDest} City Center`,
                    ticket_price: "Free",
                    image_query: `${capitalizedDest} landmark`
                },
                {
                    time: "12:00 PM - 02:30 PM",
                    description: `Enjoy lunch at a top-rated local dining spot, followed by exploring popular heritage and cultural sites in ${capitalizedDest}.`,
                    location: `${capitalizedDest} Cultural Zone`,
                    ticket_price: "$15",
                    image_query: `${capitalizedDest} food culture`
                },
                {
                    time: "03:30 PM - 06:30 PM",
                    description: `Afternoon stroll through vibrant market streets, discovering local crafts, souvenirs, and panoramic photo viewpoints.`,
                    location: `${capitalizedDest} Historic Quarter`,
                    ticket_price: "Free",
                    image_query: `${capitalizedDest} street view`
                },
                {
                    time: "07:30 PM - 10:00 PM",
                    description: `Evening dinner featuring regional specialties and sunset views across ${capitalizedDest}.`,
                    location: `${capitalizedDest} Waterfront`,
                    ticket_price: "$30",
                    image_query: `${capitalizedDest} night view`
                }
            ]
        });
    }

    return {
        trip_details: {
            currency: "$",
            estimated_budget: "350",
            best_time_to_visit: "Oct - Apr",
            travel_logistics: {
                bus: "4.5 hours",
                train: "3 hours",
                flight: "1.5 hours",
                car: "4 hours"
            },
            hotel_suggestions: [
                { name: `${capitalizedDest} Central Stay`, tier: "Budget", price_range: "$60/night" },
                { name: `${capitalizedDest} Grand Boutique Hotel`, tier: "Mid", price_range: "$120/night" },
                { name: `${capitalizedDest} Luxury Resort & Spa`, tier: "Luxury", price_range: "$250/night" }
            ],
            destination_coordinates: { lat: 28.61, lng: 77.20 }
        },
        destination: capitalizedDest,
        summary: `Experience an unforgettable ${days}-day weekend getaway to ${capitalizedDest}${origin ? ` starting from ${origin}` : ''}.${interests ? ` Focused on ${interests}.` : ''} Curated with top cultural highlights, iconic dining, and relaxed travel logistics.`,
        special_events: [],
        days: dayList
    };
}

export async function generateSuggestions(location: string) {
  try {
    const prompt = `
      Based on the starting location: "${location}", name at least 20 best and most popular weekend getaway destinations (towns or cities) that are within a reasonable travel distance (e.g. within an 8 hour drive or short flight) from ${location}. Make sure the destinations are highly varied (coastal, mountains, cultural, etc.).
      
      Provide the response as a JSON array of objects, where each object has a "name" and a "tag". The "tag" should be a 2-3 word description of the vibe (e.g., "Romantic Getaway", "Cultural Hub", "Coastal Retreat").
      
      Example:
      [
        { "name": "Destination Name 1", "tag": "Romantic Getaway" },
        { "name": "Destination Name 2", "tag": "Adventure Trail" },
        ...20 total items
      ]
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
