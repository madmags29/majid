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
        "destination": "${destination}",
        "summary": "A brief summary of the trip.",
        "days": [
          {
            "day": 1,
            "title": "Day 1 Title",
            "activities": [
              {
                "time": "morning",
                "description": "Activity description",
                "location": "Specific location name"
              },
              ...
            ]
          },
          ...
        ]
      }
      
      Ensure the JSON is valid and strict. Do not include markdown code blocks.
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
