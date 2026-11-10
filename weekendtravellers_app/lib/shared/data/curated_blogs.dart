class BlogPostModel {
  final String slug;
  final String title;
  final String destination;
  final String duration;
  final String budget;
  final String season;
  final String category;
  final String heroImage;
  final String summary;
  final List<String> highlights;
  final Map<String, String> dayPlans;

  const BlogPostModel({
    required this.slug,
    required this.title,
    required this.destination,
    required this.duration,
    required this.budget,
    required this.season,
    required this.category,
    required this.heroImage,
    required this.summary,
    required this.highlights,
    required this.dayPlans,
  });
}

class CuratedBlogsData {
  CuratedBlogsData._();

  static const List<BlogPostModel> posts = [
    BlogPostModel(
      slug: '3-day-ooty-and-coonoor-nilgiri-mountain-railway-and-tea-estates-itinerary',
      title: '3-Day Ooty & Coonoor: Nilgiri Mountain Railway and Tea Estates',
      destination: 'Ooty',
      duration: '3 Days / 2 Nights',
      budget: '₹5,500 – ₹10,500',
      season: 'Oct – May',
      category: 'Mountain Retreats',
      heroImage: 'https://images.pexels.com/photos/10323348/pexels-photo-10323348.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Ride the UNESCO Nilgiri Toy Train, tour emerald tea plantations, and gaze over Dolphin\'s Nose and Doddabetta Peak.',
      highlights: ['UNESCO Toy Train Ride', 'Tea Factory Tasting', 'Botanical Gardens', 'Dolphin\'s Nose Viewpoint'],
      dayPlans: {
        'Day 1': 'Arrive in Ooty. Explore the vibrant Government Botanical Garden and take a tranquil evening paddle on Ooty Lake.',
        'Day 2': 'Board the historic Nilgiri Mountain Railway to Coonoor. Visit Sim\'s Park and tour high-altitude tea estates.',
        'Day 3': 'Ascend Doddabetta Peak for sweeping vistas of the Nilgiris before picking up homemade chocolates and essential oils.',
      },
    ),
    BlogPostModel(
      slug: 'the-perfect-3-day-coorg-itinerary-coffee-plantations-and-abbey-falls',
      title: 'The Perfect 3-Day Coorg Itinerary: Coffee Plantations & Abbey Falls',
      destination: 'Coorg',
      duration: '3 Days / 2 Nights',
      budget: '₹5,000 – ₹9,500',
      season: 'Oct – Apr',
      category: 'Nature & Coffee',
      heroImage: 'https://images.pexels.com/photos/13442385/pexels-photo-13442385.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Immerse in the Scotland of India with fragrant arabica coffee walks, cascading waterfalls, and Tibetan monastery culture.',
      highlights: ['Abbey Falls', 'Namdroling Golden Temple', 'Mandalpatti 4x4 Jeep Safari', 'Authentic Pandi Curry'],
      dayPlans: {
        'Day 1': 'Visit the Bylakuppe Tibetan settlement and the majestic Golden Temple. Drive to Madikeri for sunset at Raja\'s Seat.',
        'Day 2': 'Sunrise jeep safari to Mandalpatti peak through misty clouds. Afternoon trek down to roaring Abbey Falls.',
        'Day 3': 'Walk through private spice & coffee plantations, taste estate roasts, and tour the historic Madikeri Fort.',
      },
    ),
    BlogPostModel(
      slug: '4-day-meghalaya-itinerary-living-root-bridges-and-dawki-river',
      title: '4-Day Meghalaya Itinerary: Living Root Bridges & Dawki River',
      destination: 'Meghalaya',
      duration: '4 Days / 3 Nights',
      budget: '₹9,000 – ₹16,000',
      season: 'Oct – Apr',
      category: 'Adventure',
      heroImage: 'https://images.pexels.com/photos/15852923/pexels-photo-15852923.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Trek the legendary Double Decker Living Root Bridge in Nongriat and boat on the crystal-clear glass waters of Dawki.',
      highlights: ['Double Decker Root Bridge', 'Dawki Glass Water Boating', 'Mawlynnong Cleanest Village', 'Nohkalikai Falls'],
      dayPlans: {
        'Day 1': 'Arrive in Shillong, drive through misty valleys to Cherrapunjee (Sohra). Witness Nohkalikai & Seven Sisters falls.',
        'Day 2': 'Hike the 3,500 stone stairs down to Nongriat\'s ancient Double Decker Living Root Bridge and swim in turquoise natural pools.',
        'Day 3': 'Early drive to Dawki on the Umngot River for glass-bottom boat rides, then visit Mawlynnong village.',
        'Day 4': 'Explore Shillong\'s cafes, Police Bazar, and Umiam Lake before heading back.',
      },
    ),
    BlogPostModel(
      slug: '3-days-in-jaisalmer-golden-fort-sam-sand-dunes-and-desert-safari',
      title: '3 Days in Jaisalmer: Golden Fort, Sam Sand Dunes & Desert Safari',
      destination: 'Jaisalmer',
      duration: '3 Days / 2 Nights',
      budget: '₹6,000 – ₹11,000',
      season: 'Oct – Mar',
      category: 'Desert Escapes',
      heroImage: 'https://images.pexels.com/photos/11029107/pexels-photo-11029107.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Explore the only living fort in India, gaze upon golden havelis, and sleep beneath a galaxy of desert stars in Thar desert.',
      highlights: ['Sonar Qila Living Fort', 'Patwon Ki Haveli', 'Sam Sand Dunes Camel Safari', 'Desert Stargazing & Folk Music'],
      dayPlans: {
        'Day 1': 'Explore Jaisalmer Fort (Sonar Qila), walk narrow sandstone alleys, and admire intricate carvings at Patwon Ki Haveli.',
        'Day 2': 'Boat on Gadisar Lake at sunrise. Drive to Sam Sand Dunes for 4x4 dune bashing, camel rides, and desert camp cultural night.',
        'Day 3': 'Visit the abandoned ghost village of Kuldhara and the Indo-Pak border heritage museum.',
      },
    ),
    BlogPostModel(
      slug: 'the-ultimate-weekend-in-mahabaleshwar-and-panchgani-strawberry-farms-and-viewpoints',
      title: 'The Ultimate Weekend in Mahabaleshwar & Panchgani: Strawberry Farms',
      destination: 'Mahabaleshwar',
      duration: '2 Days / 1 Night',
      budget: '₹4,500 – ₹8,500',
      season: 'Oct – Jun',
      category: 'Road Trips',
      heroImage: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Pick fresh farm strawberries, breathe fresh Western Ghats air, and stand atop Arthur\'s Seat and Table Land plateaus.',
      highlights: ['Mapro Garden Fresh Strawberries', 'Arthur\'s Seat Point', 'Venna Lake Boating', 'Panchgani Table Land'],
      dayPlans: {
        'Day 1': 'Drive from Mumbai/Pune up the scenic ghats. Pluck strawberries at Mapro Garden and take an evening boat ride on Venna Lake.',
        'Day 2': 'Sunrise at Wilson Point. Walk the volcanic Table Land plateau and soak in valley views from Arthur\'s Seat before driving back.',
      },
    ),
    BlogPostModel(
      slug: 'the-ultimate-3-day-hampi-itinerary-virupaksha-temple-and-hippie-island',
      title: 'The Ultimate 3-Day Hampi Itinerary: Ruins & Hippie Island',
      destination: 'Hampi',
      duration: '3 Days / 2 Nights',
      budget: '₹4,500 – ₹8,500',
      season: 'Oct – Mar',
      category: 'Cultural Explorations',
      heroImage: 'https://images.pexels.com/photos/11029114/pexels-photo-11029114.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Step into the 14th-century Vijayanagara Empire among surreal granite boulder landscapes, ancient temples, and coracle boat rides.',
      highlights: ['Stone Chariot at Vijaya Vittala', 'Virupaksha Temple', 'Matanga Hill Sunrise', 'Coracle Ride on Tungabhadra'],
      dayPlans: {
        'Day 1': 'Climb Matanga Hill for sunrise over the boulder landscape. Explore Virupaksha Temple and the Royal Enclosure.',
        'Day 2': 'Marvel at the Stone Chariot and musical pillars at Vittala Temple. Cross the Tungabhadra River in a circular coracle boat.',
        'Day 3': 'Rent bicycles on Anegundi side, climb Anjaneya Hill (Monkey Temple), and relax at Sanapur Lake.',
      },
    ),
    BlogPostModel(
      slug: 'the-ultimate-3-day-south-goa-itinerary-unspoiled-beaches-and-portuguese-mansions',
      title: 'The Ultimate 3-Day South Goa Itinerary: Unspoiled Beaches & Heritage',
      destination: 'Goa',
      duration: '3 Days / 2 Nights',
      budget: '₹6,500 – ₹13,000',
      season: 'Oct – Apr',
      category: 'Coastal Getaways',
      heroImage: 'https://images.pexels.com/photos/28368721/pexels-photo-28368721.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Ditch the crowds for serene crescent beaches like Palolem & Agonda, Portuguese Latin Quarters, and cliffside sunsets.',
      highlights: ['Palolem Crescent Beach', 'Cabo de Rama Cliff Fort', 'Fontainhas Heritage Walk', 'Goan Fish Curry Shacks'],
      dayPlans: {
        'Day 1': 'Check into beachfront hut in Palolem. Kayak around Butterfly Beach and enjoy sunset cocktails at Neptune Point.',
        'Day 2': 'Drive scooter to Cabo de Rama Fort perched over the Arabian Sea. Relax on quiet Agonda Beach.',
        'Day 3': 'Walk the colorful Portuguese streets of Fontainhas in Panjim, sampling fresh Poi and Bebinca before departure.',
      },
    ),
    BlogPostModel(
      slug: 'the-ultimate-48-hour-rishikesh-adventure-itinerary-rafting-yoga-and-ghats',
      title: 'The Ultimate 48-Hour Rishikesh Adventure: Rafting, Yoga & Ghats',
      destination: 'Rishikesh',
      duration: '2 Days / 2 Nights',
      budget: '₹3,500 – ₹7,500',
      season: 'Sep–Nov & Mar–May',
      category: 'Adventure',
      heroImage: 'https://images.pexels.com/photos/28570070/pexels-photo-28570070.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Conquer Grade III rapids on the holy Ganges, meditate at the Beatles Ashram, and witness the magical Ganga Aarti.',
      highlights: ['Shivpuri 16km River Rafting', 'Beatles Ashram Graffiti', 'Triveni Ghat Aarti', 'Cliff Jumping & Bungee'],
      dayPlans: {
        'Day 1': 'Arrive in Tapovan, visit the Beatles Ashram, cross Lakshman Jhula, and feel the spiritual energy at Triveni Ghat Aarti.',
        'Day 2': 'Thrilling 16km river rafting from Shivpuri with body surfing, cliff jumping, and riverside Maggi.',
      },
    ),
  ];

  static BlogPostModel? getBySlug(String slug) {
    final s = slug.toLowerCase().trim();
    final cleanQuery = s.replaceAll('-', ' ');
    try {
      return posts.firstWhere(
        (p) =>
            p.slug.toLowerCase() == s ||
            p.destination.toLowerCase() == s ||
            p.slug.toLowerCase().replaceAll('-', ' ') == cleanQuery,
      );
    } catch (_) {
      try {
        return posts.firstWhere(
          (p) =>
              p.slug.toLowerCase().contains(s) ||
              p.destination.toLowerCase().contains(s) ||
              p.title.toLowerCase().contains(cleanQuery) ||
              cleanQuery.contains(p.destination.toLowerCase()),
        );
      } catch (_) {
        return posts.first;
      }
    }
  }
}
