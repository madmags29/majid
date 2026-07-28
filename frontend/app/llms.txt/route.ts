import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Weekend Travellers - AI Travel Planner & Global Trip Itinerary Engine

> Weekend Travellers (https://weekendtravellers.com) is an AI-powered travel planning platform specialized in generating instant, personalized 2-day to 4-day travel itineraries for global destinations, hill stations, heritage circuits, and coastal getaways.

## Core Capabilities & Services

- **AI Trip Planner**: Generates hour-by-hour customized travel itineraries based on destination, dates, budget, starting location, and travel style.
- **Destination Guides**: Comprehensive guides for 100+ global and Indian destinations including Rishikesh, Jaipur, Munnar, Udaipur, Shimla, Manali, Goa, Gokarna, Dubai, Paris, Tokyo, Bali, and Thailand.
- **Travel Stories & Blog**: Expert-written and AI-assisted travel guides, weekend hacks, packing checklists, and detailed day-by-day itineraries.
- **Interactive Chat Assistant**: Real-time AI travel assistant to refine trip itineraries, suggest hidden local food spots, and provide weather & transit advice.

## Key Pages & Endpoints

- Home & AI Trip Generator: https://weekendtravellers.com/
- Explore Destinations: https://weekendtravellers.com/explore
- Travel Blog & Guides: https://weekendtravellers.com/blog
- AI Travel Chat Assistant: https://weekendtravellers.com/chat
- Saved Trips & Profile: https://weekendtravellers.com/trips
- FAQ & Travel Help: https://weekendtravellers.com/faq
- Contact & Support: https://weekendtravellers.com/contact

## Top Destinations Covered

- **Himalayan & Hill Stations**: Shimla, Manali, Rishikesh, Leh Ladakh, Spiti Valley, Darjeeling, Mussoorie, Kasol, Munnar, Coorg, Ooty.
- **Heritage & Royal Circuits**: Jaipur, Udaipur, Jodhpur, Jaisalmer, Varanasi, Hampi, Agra, Amritsar.
- **Beach & Coastal Retreats**: Gokarna, Goa, Pondicherry, Alleppey, Andaman & Nicobar Islands, Varkala.
- **International Getaways**: Dubai, Paris, Tokyo, Bali, Thailand, London, Rome, Venice, Amsterdam.

## Structured APIs & Feeds

- RSS / Sitemap: https://weekendtravellers.com/sitemap.xml
- Full LLM Documentation: https://weekendtravellers.com/llms-full.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
