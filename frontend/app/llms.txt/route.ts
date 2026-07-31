import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Weekend Travellers

> AI-powered travel planner generating customized 2-day to 4-day weekend itineraries, curated guides, and road trips.

Weekend Travellers is an intelligent travel planning platform designed to solve planning fatigue using generative AI and real-time travel data.

## Core Features

- [AI Weekend Travel Planner](https://weekendtravellers.com/chat): Interactive AI assistant for generating custom 2-4 day weekend itineraries.
- [Inspiration Trips](https://weekendtravellers.com/inspiration-trip): Curated visual getaway recommendations and theme-based trips.
- [Smart Search](https://weekendtravellers.com/search): Search weekend destinations, activities, and itineraries.

## Travel Guides & Destinations

- [Explore All Destinations](https://weekendtravellers.com/explore): Comprehensive index of weekend travel guides.
- [India Weekend Getaways](https://weekendtravellers.com/explore/india): Guides for Goa, Rajasthan, Kerala, Himachal Pradesh, and Indian weekend getaways.
- [International Escapes](https://weekendtravellers.com/explore/europe): Curated 2-4 day itineraries for Europe, Thailand, Bali, Dubai, and Japan.

## Articles & Information

- [Travel Blog](https://weekendtravellers.com/blog): Packing lists, road trip guides, and budget travel articles.
- [Travel FAQ](https://weekendtravellers.com/faq): Frequently asked questions about AI itineraries and bookings.
- [About Us](https://weekendtravellers.com/about): Information about Weekend Travellers and our planning technology.
- [Contact Us](https://weekendtravellers.com/contact): Get in touch with our editorial and support team.
- [Dynamic Sitemap](https://weekendtravellers.com/sitemap.xml): Complete index of all site pages and dynamic itineraries.

## Optional

- [Full Site Documentation](https://weekendtravellers.com/llms-full.txt): Complete technical architecture, features, and detailed documentation file.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
