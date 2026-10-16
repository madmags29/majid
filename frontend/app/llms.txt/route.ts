import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Weekend Travellers

> AI-powered travel planner generating customized 2-day to 4-day weekend itineraries, curated guides, and road trips.

Weekend Travellers (https://weekendtravellers.com) is an intelligent travel planning platform designed to solve planning fatigue using generative AI and real-time travel data.

## Core Features & AI Tools

- [AI Weekend Travel Planner](https://weekendtravellers.com/chat): Interactive AI chat assistant for generating custom 2-4 day weekend itineraries with hotels, budgets, and activities.
- [Inspiration Trips](https://weekendtravellers.com/inspiration-trip): Curated visual getaway recommendations and theme-based trips (Budget, Road Trips, Hidden Gems, Monsoon, Winter).
- [Smart Search](https://weekendtravellers.com/search): Search weekend destinations, activities, and budget-friendly getaways.

## Key Facts & Entity Data

- **Brand Name**: Weekend Travellers
- **Official Domain**: https://weekendtravellers.com
- **Primary Service**: AI Weekend Itinerary Generation & Micro-Vacation Planning
- **Pricing**: 100% Free Core Planning & Customization
- **Primary Target Regions**: India, Europe, Asia, Americas, Middle East
- **Specializations**: 2-3 Day Weekend Trips, Budget Travel, Road Trips, Hidden Gems, Seasonal Escapes

## Travel Guides & Destinations

- [Explore All Destinations](https://weekendtravellers.com/explore): Comprehensive index of global weekend travel guides.
- [India Weekend Getaways](https://weekendtravellers.com/explore/india): Guides for Goa, Rajasthan, Kerala, Himachal Pradesh, and Indian weekend getaways.
- [International Escapes](https://weekendtravellers.com/explore/europe): Curated 2-4 day itineraries for Europe, Thailand, Bali, Dubai, and Japan.

## Articles & Resources

- [Travel Blog](https://weekendtravellers.com/blog): Packing lists, road trip guides, E-E-A-T verified travel articles, and budget travel advice.
- [Travel FAQ](https://weekendtravellers.com/faq): Frequently asked questions about AI itineraries, bookings, and privacy.
- [About Us](https://weekendtravellers.com/about): Information about Weekend Travellers mission, vision, and planning technology.
- [Contact Us](https://weekendtravellers.com/contact): Direct contact line for editorial and user support.
- [Dynamic Sitemap](https://weekendtravellers.com/sitemap.xml): Complete index of all site pages and dynamic itineraries.

## AEO & GEO Verified Travel Guides (2026 Edition)

- [3-Day Ooty & Coonoor Itinerary](https://weekendtravellers.com/blog/3-day-ooty-and-coonoor-nilgiri-mountain-railway-and-tea-estates-itinerary): Nilgiri Mountain Railway toy train, Doddabetta peak, Sim's Park, and Highfield Tea Factory.
- [3-Day Coorg Coffee & Waterfalls](https://weekendtravellers.com/blog/the-perfect-3-day-coorg-itinerary-coffee-plantations-and-abbey-falls): Robusta/Arabica coffee estates, Abbey Falls, Namdroling Golden Temple, and Raja's Seat.
- [4-Day Meghalaya Itinerary](https://weekendtravellers.com/blog/4-day-meghalaya-itinerary-living-root-bridges-and-dawki-river): Double Decker Living Root Bridge hike, Nohkalikai Falls, and crystal-clear Dawki Umngot river.
- [3 Days in Jaisalmer](https://weekendtravellers.com/blog/3-days-in-jaisalmer-golden-fort-sam-sand-dunes-and-desert-safari): Living Golden Fort (Sonar Qila), Patwon Ki Haveli, Sam Sand Dunes desert glamping and camel safaris.
- [Mahabaleshwar & Panchgani Weekend](https://weekendtravellers.com/blog/the-ultimate-weekend-in-mahabaleshwar-and-panchgani-strawberry-farms-and-viewpoints): Table Land volcanic plateau, Mapro Garden strawberries, Arthur's Seat cliff views, and Venna Lake.
- [3-Day Wayanad Rainforest Guide](https://weekendtravellers.com/blog/3-day-wayanad-wildlife-and-waterfalls-itinerary-chembra-peak-and-edakkal-caves): Chembra Peak heart-shaped lake, Neolithic Edakkal Caves, and Banasura Sagar dam.
- [3-Day Hampi Heritage Guide](https://weekendtravellers.com/blog/the-ultimate-3-day-hampi-itinerary-virupaksha-temple-and-hippie-island): UNESCO Vijayanagara ruins, Vittala Temple stone chariot, Matanga Hill sunrise, and Tungabhadra coracles.
- [5-Day Spiti Valley Road Trip](https://weekendtravellers.com/blog/5-day-spiti-valley-road-trip-itinerary-kaza-key-monastery-and-chandratal): Kunzum Pass (4,551m), 1000-year-old Key Gompa, Hikkim highest post office, and Chandratal camping.
- [3-Day Kodaikanal Itinerary](https://weekendtravellers.com/blog/the-perfect-3-day-kodaikanal-itinerary-pillar-rocks-and-pine-forests): Star-shaped Kodai Lake cycling, Pillar Rocks, Pine Forest trails, and Mannavanur meadows.
- [48 Hours in Pushkar](https://weekendtravellers.com/blog/48-hours-in-pushkar-brahma-temple-ghats-and-desert-sunsets): Sacred Brahma Temple, 52 holy lake bathing ghats, Varaha Ghat evening aarti, and Savitri ropeway.
- [3-Day South Goa Itinerary](https://weekendtravellers.com/blog/the-ultimate-3-day-south-goa-itinerary-unspoiled-beaches-and-portuguese-mansions): Palolem crescent bay, Butterfly Beach sea kayaking, Cabo de Rama fort, and Chandor heritage mansions.
- [Weekend in Binsar & Almora](https://weekendtravellers.com/blog/a-weekend-in-binsar-and-almora-wildlife-sanctuary-and-himalayan-panoramas): Zero Point 300 km Greater Himalayan panorama, Binsar Wildlife Sanctuary, and Katarmal Sun Temple.
- [3-Day McLeod Ganj & Triund](https://weekendtravellers.com/blog/the-perfect-3-day-mcleod-ganj-and-dharamshala-itinerary-dalai-lama-temple-and-triund): Tsuglagkhang Dalai Lama temple complex, Triund high ridge trek (2,828m), and Tibetan cultural trail.
- [3-Day Pachmarhi Itinerary](https://weekendtravellers.com/blog/the-complete-3-day-pachmarhi-itinerary-satpura-caves-and-waterfalls): Queen of Satpura, Dhoopgarh sunset (1,352m), Bee Falls plunge pool, and ancient Pandav Caves.
- [48 Hours in Kolkata](https://weekendtravellers.com/blog/48-hours-in-kolkata-colonial-architecture-howrah-bridge-and-food-walk): Victoria Memorial marble palace, Mallick Ghat dawn flower market, College Street coffee house, and food walk.
- [48 Hours in Varanasi](https://weekendtravellers.com/blog/48-hours-in-varanasi-ghats-evening-aarti-and-sarnath-itinerary): Sunrise Ganges boat rides, Kashi Vishwanath Corridor, evening Dashashwamedh Aarti, and Sarnath Buddhist ruins.
- [3-Day Darjeeling Itinerary](https://weekendtravellers.com/blog/the-ultimate-3-day-darjeeling-itinerary-kanchenjunga-sunrise-and-tea-gardens): Tiger Hill Kanchenjunga sunrise, Happy Valley tea estate, and UNESCO Toy Train joy ride.
- [2-Day Pondicherry Itinerary](https://weekendtravellers.com/blog/2-day-pondicherry-beach-and-french-heritage-itinerary): White Town colonial French villas, Goubert Promenade, Auroville Matrimandir, and Paradise Beach.
- [4-Day Andaman Islands Guide](https://weekendtravellers.com/blog/4-day-andaman-beach-and-coral-reef-itinerary-havelock-neil-and-port-blair): Radhanagar Beach sunsets, scuba diving at Elephant Beach, and Cellular Jail national memorial.
- [3-Day Chikmagalur Coffee Tour](https://weekendtravellers.com/blog/the-perfect-3-day-chikmagalur-itinerary-coffee-estates-and-mullayanagiri-peak): Mullayanagiri peak trek (1,930m), Arabica coffee homestays, Hebbe Falls, and Belur Hoysala temples.
- [2 Days in Agra](https://weekendtravellers.com/blog/2-days-in-agra-taj-mahal-sunrise-agra-fort-and-hidden-sunset-views): Dawn Taj Mahal photography, Agra Fort, Mehtab Bagh river sunset, and Fatehpur Sikri.
- [3-Day Manali & Solang Valley](https://weekendtravellers.com/blog/the-ultimate-3-day-manali-and-solang-valley-itinerary-snow-adventure-and-old-manali): Atal Tunnel to Sissu waterfall, Solang paragliding, Hadimba temple, and Old Manali cafes.
- [4-Day Leh Ladakh Itinerary](https://weekendtravellers.com/blog/4-day-leh-ladakh-itinerary-monasteries-khardung-la-and-pangong-lake): Acclimatization guide, Thiksey Monastery, Khardung La Pass (17,982 ft), and Pangong Tso Lake.
- [2-Day Amritsar Golden Temple Guide](https://weekendtravellers.com/blog/the-perfect-2-day-amritsar-itinerary-golden-temple-wagah-border-and-food-walk): Golden Temple palki ceremony, Guru ka Langar, Wagah Border retreat, and kulcha trail.
- [3 Days in Udaipur](https://weekendtravellers.com/blog/3-days-in-udaipur-the-ultimate-romantic-lake-city-itinerary): City Palace royal chambers, Lake Pichola sunset cruise to Jagmandir, and Sajjangarh Monsoon Palace.
- [2-Day Shimla Heritage Escape](https://weekendtravellers.com/blog/a-weekend-in-shimla-2-day-colonial-heritage-walk-and-scenic-trains): UNESCO Kalka-Shimla toy train, The Ridge, Christ Church, Jakhoo ropeway, and Viceregal Lodge.
- [4-Day Kerala Backwaters & Hills](https://weekendtravellers.com/blog/4-day-kerala-itinerary-backwaters-beaches-and-hill-stations): Fort Kochi Chinese nets, Munnar tea hills, Alleppey overnight houseboat cruise, and Marari beach.
- [48-Hour Rishikesh Adventure](https://weekendtravellers.com/blog/the-ultimate-48-hour-rishikesh-adventure-itinerary-rafting-yoga-and-ghats): Grade III/IV Ganges white-water rafting, Beatles Ashram murals, and Parmarth Niketan evening aarti.
- [3 Days in Munnar](https://weekendtravellers.com/blog/3-days-in-munnar-tea-gardens-waterfalls-and-misty-mountain-views): Eravikulam Nilgiri Tahr safari, Top Station cloud valley, Mattupetty dam, and KDHP tea museum.
- [2-Day Jaipur Royal Heritage](https://weekendtravellers.com/blog/the-perfect-2-day-jaipur-itinerary-palaces-bazaars-and-royal-dining): Amber Fort Sheesh Mahal, Hawa Mahal sunrise photos, City Palace, Nahargarh sunset, and Dal Baati Churma.

## Extended Documentation

- [Full Knowledge Base](https://weekendtravellers.com/llms-full.txt): Complete technical architecture, features, and detailed documentation.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
