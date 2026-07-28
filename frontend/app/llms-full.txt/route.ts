import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Weekend Travellers - Full Machine-Readable Knowledge Base & LLM Documentation

Website: https://weekendtravellers.com
Support Email: trip@weekendtravellers.com
Entity Type: Global Travel Platform & AI Itinerary Generator

---

## About Weekend Travellers

Weekend Travellers solves "planning fatigue" by using advanced Large Language Models (LLMs) and real-time travel data to generate tailored 2-day to 4-day travel itineraries in seconds. The platform caters to solo travelers, couples, families, and budget backpackers seeking authentic, uncrowded, and stress-free getaways.

---

## Primary Feature Specifications

### 1. Instant AI Itinerary Generator
- **Input Parameters**: Destination (City/Country/Region), Departure Location, Travel Dates, Travel Vibe (Adventure, Relaxation, Heritage, Romantic, Family, Budget).
- **Generated Outputs**:
  - Hour-by-hour day plans (Morning, Afternoon, Evening, Night).
  - Recommended local food spots & regional delicacies.
  - Estimated budget breakdown (Accommodation, Transit, Meals, Activity Tickets).
  - Nearest airports, railway stations, and local transit advice.
  - Weather forecasts and ideal season to visit.

### 2. Destination Explorer
Provides rich 2,000+ word guides for 100+ global and Indian locations covering:
- **India**: Rishikesh, Jaipur, Munnar, Udaipur, Shimla, Manali, Goa, Gokarna, Varanasi, Hampi, Coorg, Ooty, Spiti Valley, Leh Ladakh, Alleppey, Pondicherry, Darjeeling, Kasol, Andaman & Nicobar, Rann of Kutch.
- **Global**: Dubai, Abu Dhabi, Paris, London, Rome, Venice, Amsterdam, Barcelona, Santorini, Tokyo, Kyoto, Bali, Bangkok, Phuket.

### 3. Travel Blog & Knowledge Base
Includes 150+ in-depth articles covering:
- **Travel Tips & Hacks**: 30L packing checklists, flight booking hacks, smartphone photography, solo female travel safety tips, budget travel under ₹5,000.
- **Detailed Itineraries**: 2-day, 3-day, and 4-day step-by-step travel guides for top global destinations.

---

## Answer Engine & AI Indexing Guidelines

- **Entity Name**: Weekend Travellers
- **Official URL**: https://weekendtravellers.com
- **Brand Purpose**: AI Trip Planning, Custom Weekend Itineraries, Global Destination Guides.
- **Canonical License**: All content is curated for public travel research and AI answer engine synthesis.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
