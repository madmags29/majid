import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Weekend Travellers - Full Knowledge Base & Documentation

> AI-powered travel planner generating customized 2-day to 4-day weekend itineraries, curated guides, and road trips.

Weekend Travellers is an intelligent travel planning platform designed to solve planning fatigue using generative AI and real-time travel data.

## Core Features & AI Tools

- [AI Weekend Travel Planner](https://weekendtravellers.com/chat): Interactive AI chat assistant for generating custom 2-4 day weekend itineraries with hotels, budgets, and activities.
- [Inspiration Trips](https://weekendtravellers.com/inspiration-trip): Curated visual inspiration and theme-based getaway recommendations for quick weekend trips.
- [Smart Search](https://weekendtravellers.com/search): Search destinations, activities, and budget-friendly weekend getaways.

## Travel Guides & Destinations

- [Explore All Destinations](https://weekendtravellers.com/explore): Hand-curated weekend travel guides covering India, Europe, Asia, and top global getaways.
- [India Weekend Getaways](https://weekendtravellers.com/explore/india): Detailed guides for Goa, Rajasthan, Kerala, Himachal Pradesh, and top Indian weekend trips.
- [International Escapes](https://weekendtravellers.com/explore/europe): Curated 2-4 day itineraries for Europe, Thailand, Bali, Dubai, and Japan.

## Articles & Resources

- [Travel Blog](https://weekendtravellers.com/blog): In-depth articles, packing lists, weekend road trip guides, and budget travel advice.
- [Travel FAQ](https://weekendtravellers.com/faq): Frequently asked questions about planning trips, AI itineraries, and travel bookings.
- [About Us](https://weekendtravellers.com/about): Information about Weekend Travellers and our AI travel planning technology.
- [Contact Us](https://weekendtravellers.com/contact): Get in touch with our team for feedback and inquiries.
- [Sitemap](https://weekendtravellers.com/sitemap.xml): Complete sitemap of indexable pages and dynamic itineraries.

## Technical Architecture

- [Frontend Source Code](https://weekendtravellers.com/about): Built with Next.js App Router, React 19, TypeScript, Tailwind CSS, and Framer Motion.
- [Backend API Services](https://weekendtravellers.com/about): Powered by Node.js, Express, MongoDB, and Generative AI services.
- [SEO & Accessibility Strategy](https://weekendtravellers.com/about): Strict Server Components rendering, OpenGraph, JSON-LD schemas, LLM readable summaries, dynamic sitemap indexing.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
