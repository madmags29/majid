const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is required.');
    process.exit(1);
}

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    content: { type: String, required: true },
    heroImage: { type: String, required: true },
    images: [{ type: String }],
    keyword: { type: String, required: true },
    author: { type: String, default: 'Weekend Travellers' },
    publishedDate: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],
    readingTime: { type: String }
}, { timestamps: true });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

const newPosts = [
  // TRAVEL TIPS POSTS
  {
    title: "15 Genius Travel Hacks Every Weekend Traveler Should Know",
    slug: "15-genius-travel-hacks-every-weekend-traveler-should-know",
    metaTitle: "15 Genius Weekend Travel Hacks & Tips | Save Money & Time",
    metaDescription: "Master weekend travel with 15 smart hacks: packing light, finding cheap flight deals, offline maps, and maximizing 48-hour trips.",
    keyword: "weekend travel hacks and tips",
    publishedDate: new Date("2026-07-29T10:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "10 min read",
    heroImage: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "How to travel light for a 2-day weekend trip?", answer: "Use a 25L-30L backpack, pack a 4-item capsule wardrobe, and wear your heaviest shoes while traveling." },
      { question: "What are the best apps for weekend trips?", answer: "Google Maps offline mode, PackPoint, Ixigo for train tracking, and Splitwise for group expense sharing." }
    ],
    contentJson: {
      title: "15 Genius Travel Hacks Every Weekend Traveler Should Know",
      metaTitle: "15 Genius Weekend Travel Hacks & Tips | Save Money & Time",
      metaDescription: "Master weekend travel with 15 smart hacks: packing light, finding cheap flight deals, offline maps, and maximizing 48-hour trips.",
      introduction: "Short weekend getaways are the best way to recharge without taking extended work leave. However, poor planning can turn 48 hours into a stressful rush. Here are 15 game-changing travel hacks to make every weekend trip seamless, affordable, and memorable.",
      sections: [
        { heading: "1. The 30L Backpack & Capsule Wardrobe Secret", content: "Never check in luggage for a weekend trip. Carry a 30L backpack packed with mix-and-match neutral clothing layers. You'll skip airport luggage carousels and move effortlessly on local public transit." },
        { heading: "2. Download Maps & Digital Documents Offline", content: "Before departing, download offline Google Maps areas and save PDF copies of hotel reservations and ID cards in your phone notes. Signals can drop in high mountain passes and coastal zones." },
        { heading: "3. Red-Eye Flights & Overnight Sleeper Trains", content: "Maximize daytime exploration by taking Friday night sleeper trains or late-night flights. You wake up directly at your destination ready to start your Saturday morning." },
        { heading: "4. Digital Multi-Tool & Tech Pouch Organization", content: "Organize chargers, power banks, and adapters in a dedicated cable organizer. A fast-charging 20,000mAh power bank ensures your camera and phone never die during daytime sight-seeing." },
        { heading: "5. Ask Locals Instead of Relying Only on Top-10 Lists", content: "Chat with your homestay host or local cafe barista for hidden lunch spots and scenic view points that tourist blogs miss." }
      ],
      travelTips: [
        "Roll clothes instead of folding to save 40% more bag space.",
        "Carry a reusable insulated water bottle to stay hydrated and reduce plastic waste.",
        "Set price alerts on flight aggregators 3-4 weeks before long weekends."
      ],
      faqs: [
        { question: "How to travel light for a 2-day weekend trip?", answer: "Use a 25L-30L backpack with a 4-item capsule wardrobe." }
      ],
      conclusion: "Smart weekend travel is about efficiency and mindset. Apply these 15 hacks on your next getaway to enjoy stress-free micro-adventures!"
    }
  },
  {
    title: "How to Plan a Budget Weekend Trip in India for Under ₹5,000",
    slug: "how-to-plan-a-budget-weekend-trip-in-india-under-5000",
    metaTitle: "Budget Weekend Trip in India Under ₹5000 | Money-Saving Guide",
    metaDescription: "Learn how to plan an incredible 2-day trip in India under ₹5,000. Covers cheap trains, hostel stays, street food, and free walking tours.",
    keyword: "budget travel tips India under 5000",
    publishedDate: new Date("2026-07-30T11:30:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "11 min read",
    heroImage: "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Which Indian destinations are best for a ₹5,000 budget?", answer: "Rishikesh, Jaipur, Gokarna, Varanasi, McLeod Ganj, and Pondicherry." },
      { question: "Are backpacker hostels safe and clean in India?", answer: "Yes! Major chains like Zostel, Hosteller, and Gostops offer clean dorms with lockers and security for ₹500-₹900 per night." }
    ],
    contentJson: {
      title: "How to Plan a Budget Weekend Trip in India for Under ₹5,000",
      metaTitle: "Budget Weekend Trip in India Under ₹5000 | Money-Saving Guide",
      metaDescription: "Learn how to plan an incredible 2-day trip in India under ₹5,000. Covers cheap trains, hostel stays, street food, and free walking tours.",
      introduction: "You don't need a fortune to experience the beauty of India. With smart financial choices, a thrilling 2-day weekend adventure can easily fit within a ₹5,000 budget including transport, lodging, food, and activities.",
      sections: [
        { heading: "1. Transportation: Sleeper Trains & State Transport Buses (Cost: ₹800 - ₹1,400)", content: "Book IRCTC 3AC or Sleeper train tickets in advance, or board government Volvo/express buses. Night travel saves one night of accommodation cost!" },
        { heading: "2. Lodging: Backpacker Hostels & Homestays (Cost: ₹1,000 - ₹1,600 for 2 nights)", content: "Opt for bunk beds in social hostels like Zostel, Hosteller, or Gostops. You get clean bedding, Wi-Fi, air conditioning, and meet fellow travelers." },
        { heading: "3. Food: Authentic Street Food & Local Dhabas (Cost: ₹1,200 for 2 days)", content: "Skip fancy tourist cafes and dine where locals eat. Savor hot kachoris in Jaipur, fresh thalis in Rishikesh, or seafood shacks in Gokarna." },
        { heading: "4. Sightseeing: Free Walking Tours & Public Heritage Spots (Cost: ₹500)", content: "Many historic monuments have nominal entry fees (₹20-₹50). Explore ancient bazaars, ghats, and nature trails that cost nothing." }
      ],
      travelTips: [
        "Always travel with friends to split auto-rickshaw fares and room costs.",
        "Carry student or youth IDs for discounts at museums and heritage forts.",
        "Track expenses in real-time using Splitwise or Wallet app."
      ],
      faqs: [
        { question: "Which Indian destinations are best for a ₹5,000 budget?", answer: "Rishikesh, Jaipur, Gokarna, Varanasi, and McLeod Ganj." }
      ],
      conclusion: "Budget travel in India isn't about compromising on experience—it's about immersing in authentic local culture without overspending."
    }
  },
  {
    title: "Solo Female Travel in India: Top 10 Safety Tips & Destination Guide",
    slug: "solo-female-travel-in-india-top-10-safety-tips-and-destination-guide",
    metaTitle: "Solo Female Travel Safety Tips India & Best Destinations Guide",
    metaDescription: "Essential safety advice for solo female travelers in India. Includes top safe destinations, accommodation tips, and cultural etiquette.",
    keyword: "solo female travel safety tips India",
    publishedDate: new Date("2026-07-31T09:15:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Which cities in India are safest for solo female travelers?", answer: "Udaipur, Pondicherry, Rishikesh, Munnar, Mysuru, Sikkim, and Gokarna are widely recognized for warm hospitality and safety." },
      { question: "Should female travelers choose female-only dorms?", answer: "Yes, booking female-only hostel dorms provides extra privacy and comfort." }
    ],
    contentJson: {
      title: "Solo Female Travel in India: Top 10 Safety Tips & Destination Guide",
      metaTitle: "Solo Female Travel Safety Tips India & Best Destinations Guide",
      metaDescription: "Essential safety advice for solo female travelers in India. Includes top safe destinations, accommodation tips, and cultural etiquette.",
      introduction: "Solo female travel across India is an empowering and life-changing journey. While India's rich heritage and warm hospitality attract thousands of solo women travelers, smart safety habits ensure a comfortable and secure adventure.",
      sections: [
        { heading: "1. Choose Welcoming & Verified Destinations", content: "Start with female-friendly destinations known for solo traveler infrastructure: Udaipur (Rajasthan), Rishikesh (Uttarakhand), Pondicherry, Munnar (Kerala), and Gangtok (Sikkim)." },
        { heading: "2. Stay in Female-Only Hostel Dorms or Verified Homestays", content: "Book female-only dorms in top-rated hostel chains like Zostel or Hosteller. They offer 24/7 security, personal lockers, and a vibrant community of female travelers." },
        { heading: "3. Arrive in New Cities During Daylight Hours", content: "Schedule flights, trains, and buses to land in new destinations between 7:00 AM and 5:00 PM. Navigating unfamiliar streets in daylight is always safer and easier." },
        { heading: "4. Use App-Based Transport & Share Live Location", content: "Use Uber, Ola, or Rapido for city commutes so rides are GPS-tracked. Share live location with trusted family members via WhatsApp or Google Maps." },
        { heading: "5. Dress Respectfully at Religious & Rural Sites", content: "Blend in with local customs by wearing breathable cotton kurtis, linen pants, or carrying a lightweight scarf (dupatta) for temple visits." }
      ],
      travelTips: [
        "Keep emergency contact numbers saved on speed dial and carry a portable door lock for extra room security.",
        "Trust your instincts: if a situation or person feels uncomfortable, politely disengage and move to a crowded shop or cafe."
      ],
      faqs: [
        { question: "Which cities in India are safest for solo female travelers?", answer: "Udaipur, Pondicherry, Rishikesh, Munnar, Mysuru, and Sikkim." }
      ],
      conclusion: "With practical preparation and confidence, solo female travel in India opens doors to unforgettable friendships and cultural wonder."
    }
  },
  {
    title: "The Ultimate Weekend Packing Checklist: What to Pack for Every Climate",
    slug: "the-ultimate-weekend-packing-checklist-what-to-pack-for-every-climate",
    metaTitle: "Ultimate Weekend Travel Packing Checklist | Mountain & Beach Guide",
    metaDescription: "Never forget essential travel gear again. Complete 48-hour packing checklist for mountain getaways, beach trips, and city breaks.",
    keyword: "ultimate weekend travel packing checklist",
    publishedDate: new Date("2026-08-01T14:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "10 min read",
    heroImage: "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What is the 5-4-3-2-1 packing rule for weekend trips?", answer: "Pack 5 sets of socks/undergarments, 4 tops, 3 bottoms, 2 pairs of shoes, and 1 hat/jacket." },
      { question: "How to fit everything into a carry-on bag?", answer: "Use compression packing cubes and wear your bulkiest jacket and boots while traveling." }
    ],
    contentJson: {
      title: "The Ultimate Weekend Packing Checklist: What to Pack for Every Climate",
      metaTitle: "Ultimate Weekend Travel Packing Checklist | Mountain & Beach Guide",
      metaDescription: "Never forget essential travel gear again. Complete 48-hour packing checklist for mountain getaways, beach trips, and city breaks.",
      introduction: "Packing for a weekend trip should take 15 minutes, not two stressful hours. Whether heading to snowy Himalayan peaks, tropical palm beaches, or historic fort cities, this master checklist ensures you never leave essentials behind.",
      sections: [
        { heading: "1. The Universal Core Checklist (Every Trip)", content: "Government photo ID, wallet & cash, smartphone & charger, 10,000mAh power bank, basic toiletries pouch, and personal medications." },
        { heading: "2. Mountain & Hill Station Packing List", content: "Thermal inner layers, fleece jacket, windproof outer shell, wool beanie, sturdy hiking boots, lip balm, and cold cream." },
        { heading: "3. Coastal & Beach Getaway Packing List", content: "Breathable linen shirts/dresses, swimwear, quick-dry microfiber towel, SPF 50+ reef-safe sunscreen, sunglasses, and waterproof dry bag." },
        { heading: "4. Tech & Utility Extras", content: "Noise-canceling earphones, multi-plug adapter, compact camera, reusable water bottle, and a mini flashlight for night walks." }
      ],
      travelTips: [
        "Use color-coded packing cubes to keep clean and dirty clothes separate.",
        "Store liquid toiletries in leak-proof 100ml silicone bottles."
      ],
      faqs: [
        { question: "What is the 5-4-3-2-1 packing rule?", answer: "5 socks/undergarments, 4 tops, 3 bottoms, 2 shoes, 1 jacket." }
      ],
      conclusion: "With a streamlined packing routine, you spend less time worrying about luggage and more time exploring."
    }
  },
  {
    title: "How to Take Professional Travel Photos with Your Smartphone",
    slug: "how-to-take-professional-travel-photos-with-your-smartphone",
    metaTitle: "Smartphone Travel Photography Tips | Capture Stunning Travel Photos",
    metaDescription: "Upgrade your travel photos using your smartphone. Master golden hour lighting, rule of thirds composition, and mobile editing apps.",
    keyword: "smartphone travel photography tips",
    publishedDate: new Date("2026-08-02T16:20:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "11 min read",
    heroImage: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What are the best free mobile photo editing apps?", answer: "Lightroom Mobile, Snapseed, and VSCO offer powerful RAW editing tools." },
      { question: "How to avoid blurry smartphone photos in low light?", answer: "Tap to lock focus, use Night Mode, and hold your elbows firmly against your chest or rest the phone on a flat surface." }
    ],
    contentJson: {
      title: "How to Take Professional Travel Photos with Your Smartphone",
      metaTitle: "Smartphone Travel Photography Tips | Capture Stunning Travel Photos",
      metaDescription: "Upgrade your travel photos using your smartphone. Master golden hour lighting, rule of thirds composition, and mobile editing apps.",
      introduction: "You don't need heavy DSLR cameras to capture magazine-worthy travel photos. Today's smartphones feature high-resolution sensors and computational photography. Here is how to unlock professional shots on your phone.",
      sections: [
        { heading: "1. Enable Grid Lines & Master Rule of Thirds", content: "Turn on the 3x3 grid in camera settings. Place key subjects—like a mountain peak, street performer, or ocean horizon—along grid lines or intersection points." },
        { heading: "2. Chase Golden Hour & Blue Hour Light", content: "Shoot during sunrise and sunset when natural light is soft, warm, and long shadows create dramatic depth across landscapes and architecture." },
        { heading: "3. Use Leading Lines & Natural Framing", content: "Use roads, rivers, archways, and overhanging tree branches to lead the viewer's eye into the heart of the image." },
        { heading: "4. Clean the Camera Lens & Tap Exposure Control", content: "Always wipe your camera lens with a microfiber cloth before shooting. Tap the screen to focus and slide the sun icon down slightly to avoid blown-out highlights." }
      ],
      travelTips: [
        "Include a human element (e.g. someone wearing a bright jacket) in wide landscape shots to add scale.",
        "Edit in Adobe Lightroom Mobile: boost shadows slightly and tweak warmth for natural colors."
      ],
      faqs: [
        { question: "What are the best free photo editing apps?", answer: "Lightroom Mobile and Snapseed." }
      ],
      conclusion: "Great travel photography is about vision, lighting, and composition—skills you can practice on every trip with the phone in your pocket."
    }
  },

  // ITINERARY POSTS
  {
    title: "The Perfect 2-Day Jaipur Itinerary: Palaces, Bazaars & Royal Dining",
    slug: "the-perfect-2-day-jaipur-itinerary-palaces-bazaars-and-royal-dining",
    metaTitle: "Perfect 2-Day Jaipur Itinerary: Amber Fort, Hawa Mahal & Bazaars",
    metaDescription: "Plan an epic 48 hours in Pink City Jaipur. Hour-by-hour 2-day itinerary covering Amber Fort, Hawa Mahal sunrise, Johari Bazaar, and Nahargarh sunset.",
    keyword: "2 day Jaipur itinerary travel guide",
    publishedDate: new Date("2026-08-03T10:45:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What is the best time to photograph Hawa Mahal?", answer: "Early morning around 7:30 AM when sun rays illuminate the pink honeycomb facade with minimal traffic." },
      { question: "How to travel between sights in Jaipur?", answer: "E-rickshaws, auto-rickshaws, or hiring a full-day private taxi." }
    ],
    contentJson: {
      title: "The Perfect 2-Day Jaipur Itinerary: Palaces, Bazaars & Royal Dining",
      metaTitle: "Perfect 2-Day Jaipur Itinerary: Amber Fort, Hawa Mahal & Bazaars",
      metaDescription: "Plan an epic 48 hours in Pink City Jaipur. Hour-by-hour 2-day itinerary covering Amber Fort, Hawa Mahal sunrise, Johari Bazaar, and Nahargarh sunset.",
      introduction: "Jaipur, the vibrant capital of Rajasthan, is a royal symphony of pink sandstone fortresses, bustling spice bazaars, and opulent palaces. Here is the ultimate 48-hour weekend itinerary.",
      sections: [
        { heading: "Day 1 Morning: Hawa Mahal Sunrise & City Palace", content: "Start at 7:30 AM outside Hawa Mahal for quiet photo sessions. Walk into City Palace to admire the peacock gates and royal armory museum." },
        { heading: "Day 1 Afternoon & Evening: Jantar Mantar & Nahargarh Fort Sunset", content: "Explore UNESCO-listed Jantar Mantar sundials, then drive up to Nahargarh Fort for a breathtaking sunset over the entire Pink City skyline." },
        { heading: "Day 2 Morning: Sheesh Mahal at Amber Fort & Stepwell", content: "Tour the majestic Amber Fort, marveling at the mirror work of Sheesh Mahal, and photograph the geometric symmetry of Panna Meena Ka Kund stepwell." },
        { heading: "Day 2 Afternoon & Evening: Shopping in Johari Bazaar & Thali Dinner", content: "Shop for block-printed textiles, blue pottery, and silver jewelry in Johari & Bapu Bazaars. Conclude with a traditional Rajasthani Dal Baati Churma thali." }
      ],
      travelTips: [
        "Buy a Composite Ticket (₹300 for Indians) covering Amber Fort, Albert Hall, Jantar Mantar, and Nahargarh.",
        "Savor pyaz kachori and lassi at Rawat Mishthan Bhandar."
      ],
      faqs: [
        { question: "What is the best time to photograph Hawa Mahal?", answer: "Early morning around 7:30 AM." }
      ],
      conclusion: "This 2-day itinerary captures the grandeur, colors, and culinary magic of Jaipur."
    }
  },
  {
    title: "3 Days in Munnar: Tea Gardens, Waterfalls & Misty Mountain Views",
    slug: "3-days-in-munnar-tea-gardens-waterfalls-and-misty-mountain-views",
    metaTitle: "3-Day Munnar Itinerary: Tea Plantations, Eravikulam & Lakes",
    metaDescription: "Explore Munnar's emerald tea slopes in 3 days. Complete guide featuring Top Station sunrise, Eravikulam National Park, and Mattupetty Dam.",
    keyword: "3 days Munnar itinerary tea gardens",
    publishedDate: new Date("2026-08-04T12:10:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "13 min read",
    heroImage: "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "How to reach Munnar from Kochi?", answer: "Munnar is a 3.5 to 4-hour scenic drive (125 km) from Kochi Airport or Ernakulam station." },
      { question: "When does the Neelakurinji flower bloom in Munnar?", answer: "Neelakurinji blooms once every 12 years, carpeting hillsides in purple." }
    ],
    contentJson: {
      title: "3 Days in Munnar: Tea Gardens, Waterfalls & Misty Mountain Views",
      metaTitle: "3-Day Munnar Itinerary: Tea Plantations, Eravikulam & Lakes",
      metaDescription: "Explore Munnar's emerald tea slopes in 3 days. Complete guide featuring Top Station sunrise, Eravikulam National Park, and Mattupetty Dam.",
      introduction: "Situated 1,600 meters above sea level in Kerala's Western Ghats, Munnar is a lush haven of endless tea plantations, mist-covered peaks, and wild mountain streams.",
      sections: [
        { heading: "Day 1: KDHP Tea Museum & Mattupetty Dam Boating", content: "Learn about tea processing at Tata Tea Museum, walk through spice gardens, and enjoy speedboating on Mattupetty Lake." },
        { heading: "Day 2: Eravikulam National Park & Top Station", content: "Take the safari bus up Eravikulam National Park to spot Nilgiri Tahr mountain goats, then continue to Top Station for panoramic Tamil Nadu valley views." },
        { heading: "Day 3: Lakkam Waterfalls & Marayoor Sandalwood Forests", content: "Visit cascading Lakkam Waterfalls, explore prehistoric dolmens in Marayoor, and shop for authentic Kerala spices and tea packages." }
      ],
      travelTips: [
        "Carry light woolens as temperatures drop in the evenings.",
        "Book Eravikulam park entry tickets online to skip long morning queues."
      ],
      faqs: [
        { question: "How to reach Munnar from Kochi?", answer: "A 3.5-hour scenic drive (125 km)." }
      ],
      conclusion: "Munnar delivers pure mountain tranquility and breathtaking green vistas."
    }
  },
  {
    title: "The Ultimate 48-Hour Rishikesh Adventure Itinerary: Rafting, Yoga & Ghats",
    slug: "the-ultimate-48-hour-rishikesh-adventure-itinerary-rafting-yoga-and-ghats",
    metaTitle: "48-Hour Rishikesh Itinerary: River Rafting, Yoga & Ganga Aarti",
    metaDescription: "Plan 2 action-packed days in Rishikesh. River rafting on the Ganges, Beatles Ashram, cliff jumping, organic cafe hopping, and evening Aarti.",
    keyword: "48 hour Rishikesh adventure itinerary",
    publishedDate: new Date("2026-08-05T08:30:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "11 min read",
    heroImage: "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "When is the best season for river rafting in Rishikesh?", answer: "September to November and March to June offer optimal water levels and clear skies." },
      { question: "Is Rishikesh suitable for solo travelers?", answer: "Extremely suitable! Rishikesh is one of India's safest and most welcoming towns." }
    ],
    contentJson: {
      title: "The Ultimate 48-Hour Rishikesh Adventure Itinerary: Rafting, Yoga & Ghats",
      metaTitle: "48-Hour Rishikesh Itinerary: River Rafting, Yoga & Ganga Aarti",
      metaDescription: "Plan 2 action-packed days in Rishikesh. River rafting on the Ganges, Beatles Ashram, cliff jumping, organic cafe hopping, and evening Aarti.",
      introduction: "Perched where the holy Ganges emerges from the Himalayas, Rishikesh is the Yoga Capital of the World and India's premier river adventure hub.",
      sections: [
        { heading: "Day 1 Morning: White-Water Rafting & Cliff Jumping", content: "Tackle Grade III rapids from Shivpuri to Rishikesh (16 km stretch) including Three Blind Mice and Roller Coaster rapids, ending with a cliff jump." },
        { heading: "Day 1 Afternoon & Evening: Beatles Ashram & Triveni Ghat Aarti", content: "Explore graffiti-covered meditation domes at Chaurasi Kutia (Beatles Ashram), then witness grand Ganga Aarti at Triveni Ghat." },
        { heading: "Day 2 Morning: Sunrise Yoga & Secret Waterfalls", content: "Join an early morning Hatha yoga session overlooking the Ganges, followed by a short trek to Neer Garh Waterfall." },
        { heading: "Day 2 Afternoon: Organic Cafe Hopping at Tapovan", content: "Relax at popular riverside cafes like Freedom Cafe or Little Buddha, enjoying vegan bowls, Ayurvedic teas, and views of Laxman Jhula." }
      ],
      travelTips: [
        "Book certified rafting operators equipped with life jackets and rescue kayaks.",
        "Note that Rishikesh is a holy city where meat and alcohol are strictly prohibited."
      ],
      faqs: [
        { question: "When is the best season for rafting in Rishikesh?", answer: "September-November and March-June." }
      ],
      conclusion: "Rishikesh perfectly balances adrenaline thrills with deep spiritual rejuvenation."
    }
  },
  {
    title: "4-Day Kerala Itinerary: Backwaters, Beaches & Hill Stations",
    slug: "4-day-kerala-itinerary-backwaters-beaches-and-hill-stations",
    metaTitle: "4-Day Kerala Itinerary: Kochi, Munnar, Alleppey & Marari Beach",
    metaDescription: "The ultimate 4-day trip in God's Own Country. Explore Fort Kochi heritage, Munnar tea hills, Alleppey houseboat, and Marari beach.",
    keyword: "4 day Kerala travel itinerary",
    publishedDate: new Date("2026-08-06T15:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "14 min read",
    heroImage: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What airport to fly into for Kerala?", answer: "Cochin International Airport (COK) is centrally located for Munnar, Alleppey, and Kochi." },
      { question: "Is a 4-day trip enough for Kerala?", answer: "Yes! A 4-day loop covering Kochi, Munnar, and Alleppey captures the best highlights of Kerala." }
    ],
    contentJson: {
      title: "4-Day Kerala Itinerary: Backwaters, Beaches & Hill Stations",
      metaTitle: "4-Day Kerala Itinerary: Kochi, Munnar, Alleppey & Marari Beach",
      metaDescription: "The ultimate 4-day trip in God's Own Country. Explore Fort Kochi heritage, Munnar tea hills, Alleppey houseboat, and Marari beach.",
      introduction: "Kerala, celebrated as 'God's Own Country', presents a diverse tapestry of tropical experiences. This 4-day itinerary combines cultural heritage, emerald mountain mist, and peaceful backwater cruises.",
      sections: [
        { heading: "Day 1: Fort Kochi Colonial Heritage & Chinese Fishing Nets", content: "Explore Fort Kochi's Portuguese streets, Mattancherry Palace, Jew Town, and watch fishermen operate ancient Chinese Fishing Nets." },
        { heading: "Day 2: Scenic Drive to Munnar & Tea Plantation Walk", content: "Drive up to Munnar past Cheeyappara Waterfalls, checking into a tea estate resort for an afternoon walking tour." },
        { heading: "Day 3: Overnight Houseboat Cruise in Alleppey", content: "Head down to Alleppey, boarding a private houseboat to cruise through calm palm-fringed canals of Vembanad Lake." },
        { heading: "Day 4: Sunset at Marari Beach & Departure", content: "Unwind on the pristine white sands of Marari Beach before heading back to Cochin airport." }
      ],
      travelTips: [
        "Try an authentic Ayurvedic massage at a licensed wellness center.",
        "Pre-book a private car driver for smooth inter-city transfers."
      ],
      faqs: [
        { question: "What airport to fly into for Kerala?", answer: "Cochin International Airport (COK)." }
      ],
      conclusion: "This 4-day route is the quintessential Kerala experience for couples and family getaways."
    }
  },
  {
    title: "A Weekend in Shimla: 2-Day Colonial Heritage Walk & Scenic Trains",
    slug: "a-weekend-in-shimla-2-day-colonial-heritage-walk-and-scenic-trains",
    metaTitle: "2-Day Shimla Itinerary: Heritage Walk, Mall Road & Kalka Toy Train",
    metaDescription: "Discover Shimla in 48 hours. Ride UNESCO Kalka-Shimla Toy Train, walk the Ridge, tour Viceregal Lodge, and hike to Jakhoo Temple.",
    keyword: "2 day Shimla weekend itinerary",
    publishedDate: new Date("2026-08-07T11:15:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "11 min read",
    heroImage: "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What is the best way to travel from Delhi to Shimla?", answer: "Take an overnight train to Kalka, followed by the scenic Kalka-Shimla Toy Train or a 7-hour drive." },
      { question: "Is Mall Road in Shimla pedestrian-only?", answer: "Yes! Vehicles are prohibited on Mall Road and The Ridge, making it a peaceful walking promenade." }
    ],
    contentJson: {
      title: "A Weekend in Shimla: 2-Day Colonial Heritage Walk & Scenic Trains",
      metaTitle: "2-Day Shimla Itinerary: Heritage Walk, Mall Road & Kalka Toy Train",
      metaDescription: "Discover Shimla in 48 hours. Ride UNESCO Kalka-Shimla Toy Train, walk the Ridge, tour Viceregal Lodge, and hike to Jakhoo Temple.",
      introduction: "Once the Summer Capital of British India, Shimla nestles among pine forests and Himalayan ridges. Its neo-gothic architecture and car-free promenades make it a classic hill retreat.",
      sections: [
        { heading: "Day 1 Morning: Kalka-Shimla Toy Train & The Ridge", content: "Arrive via the iconic UNESCO Toy Train crossing 102 tunnels. Stroll along The Ridge, admiring Christ Church's stained glass windows." },
        { heading: "Day 1 Afternoon: Viceregal Lodge & Heritage Walk", content: "Tour the grand Scottish baronial Rashtrapati Niwas (Viceregal Lodge) where pivotal historic treaties were drafted." },
        { heading: "Day 2 Morning: Jakhoo Temple Hike & Ropeway", content: "Hike or ride the aerial ropeway up Jakhoo Hill to visit the 108-foot Hanuman statue overlooking snow peaks." },
        { heading: "Day 2 Afternoon: Excursion to Kufri & Mall Road Shopping", content: "Take a short drive to Kufri for mountain views, then finish your weekend tasting plum wine and local bakeries on Mall Road." }
      ],
      travelTips: [
        "Watch out for playful monkeys near Jakhoo Temple and keep sunglasses secured.",
        "Visit between December and February for snow, or April-June for pleasant summer weather."
      ],
      faqs: [
        { question: "Is Mall Road pedestrian-only?", answer: "Yes, vehicles are strictly restricted." }
      ],
      conclusion: "Shimla offers timeless colonial charm and stunning Himalayan views for a quick weekend reset."
    }
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully to MongoDB.");

    let insertedCount = 0;

    for (const postData of newPosts) {
      const contentString = JSON.stringify(postData.contentJson);
      const postDoc = {
        title: postData.title,
        slug: postData.slug,
        metaTitle: postData.metaTitle,
        metaDescription: postData.metaDescription,
        content: contentString,
        heroImage: postData.heroImage,
        images: postData.images,
        keyword: postData.keyword,
        author: postData.author,
        publishedDate: postData.publishedDate,
        isPublished: postData.isPublished,
        faqs: postData.faqs,
        readingTime: postData.readingTime
      };

      const result = await BlogPost.findOneAndUpdate(
        { slug: postData.slug },
        postDoc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`[OK] Saved: "${result.title}" | Date: ${result.publishedDate.toISOString()} | Slug: ${result.slug}`);
      insertedCount++;
    }

    console.log(`\n🎉 Successfully seeded ${insertedCount} Travel Tips & Itineraries blog posts into MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding blog posts:", err);
    process.exit(1);
  }
}

seed();
