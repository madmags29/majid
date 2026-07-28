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
  {
    title: "3 Days in Udaipur: The Ultimate Romantic Lake City Itinerary",
    slug: "3-days-in-udaipur-the-ultimate-romantic-lake-city-itinerary",
    metaTitle: "3-Day Udaipur Itinerary: City Palace, Lake Pichola & Sunsets",
    metaDescription: "Plan a dream 3-day trip to Udaipur. Hour-by-hour itinerary covering City Palace, Jagmandir boat ride, Saheliyon Ki Bari, and Sajjangarh Monsoon Palace.",
    keyword: "3 days Udaipur itinerary travel guide",
    publishedDate: new Date("2026-08-08T10:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "13 min read",
    heroImage: "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Where is the best sunset view in Udaipur?", answer: "Ambrai Ghat or the hilltop Monsoon Palace (Sajjangarh)." },
      { question: "How to take a boat ride on Lake Pichola?", answer: "Boats depart continuously from Rameshwar Ghat inside City Palace complex." }
    ],
    contentJson: {
      title: "3 Days in Udaipur: The Ultimate Romantic Lake City Itinerary",
      metaTitle: "3-Day Udaipur Itinerary: City Palace, Lake Pichola & Sunsets",
      metaDescription: "Plan a dream 3-day trip to Udaipur. Hour-by-hour itinerary covering City Palace, Jagmandir boat ride, Saheliyon Ki Bari, and Sajjangarh Monsoon Palace.",
      introduction: "Udaipur, the Venice of the East, charms travelers with glowing palaces reflected in tranquil lakes, narrow old city lanes, and royal Mewari heritage. Here is the perfect 3-day itinerary.",
      sections: [
        { heading: "Day 1: City Palace Grandeur & Lake Pichola Sunset Cruise", content: "Explore the sprawling City Palace complex, museum court, and take a late afternoon boat ride past Lake Palace to Jagmandir Island." },
        { heading: "Day 2: Jagdish Temple, Saheliyon Ki Bari & Ambrai Ghat Dining", content: "Visit 17th-century Jagdish Temple, stroll through the marble fountains of Saheliyon Ki Bari, and dine lakeside at Ambrai." },
        { heading: "Day 3: Sajjangarh Monsoon Palace & Shilpgram Craft Village", content: "Drive up Aravalli hills to Sajjangarh Monsoon Palace for panoramic valley views, ending at Shilpgram rural arts & crafts complex." }
      ],
      travelTips: ["Book rooftop lake-view hotel rooms in the Old City.", "Try authentic Ker Sangri and Laal Maas."],
      faqs: [
        { question: "Where is the best sunset view in Udaipur?", answer: "Ambrai Ghat or Sajjangarh Monsoon Palace." }
      ],
      conclusion: "This 3-day Udaipur itinerary combines regal history, romance, and enchanting lake views."
    }
  },
  {
    title: "The Perfect 2-Day Amritsar Itinerary: Golden Temple, Wagah Border & Food Walk",
    slug: "the-perfect-2-day-amritsar-itinerary-golden-temple-wagah-border-and-food-walk",
    metaTitle: "2-Day Amritsar Itinerary: Golden Temple, Wagah Border & Kulcha Walk",
    metaDescription: "Explore Amritsar in 48 hours. Golden Temple Pavitra Sarovar, Jallianwala Bagh, Wagah Border retreat ceremony, and iconic Punjabi food walk.",
    keyword: "2 day Amritsar itinerary travel guide",
    publishedDate: new Date("2026-08-09T11:30:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What is the best time to visit the Golden Temple?", answer: "Visit at dawn (4:00 AM) for Palki Sahib ceremony or late evening when gold domes light up." },
      { question: "How to reach Wagah Border from Amritsar city?", answer: "Wagah Border is 30 km away; shared taxis and AC buses depart from near Golden Temple around 2:30 PM." }
    ],
    contentJson: {
      title: "The Perfect 2-Day Amritsar Itinerary: Golden Temple, Wagah Border & Food Walk",
      metaTitle: "2-Day Amritsar Itinerary: Golden Temple, Wagah Border & Kulcha Walk",
      metaDescription: "Explore Amritsar in 48 hours. Golden Temple Pavitra Sarovar, Jallianwala Bagh, Wagah Border retreat ceremony, and iconic Punjabi food walk.",
      introduction: "Amritsar, the spiritual heart of Punjab, is home to the revered Sri Harmandir Sahib (Golden Temple), patriotic history, and world-famous Punjabi cuisine.",
      sections: [
        { heading: "Day 1 Morning: Golden Temple Sanctum & Langar Experience", content: "Walk around the holy Amrit Sarovar lake, enter the golden sanctum, and participate in Guru Ram Das Langar, serving 100,000 free meals daily." },
        { heading: "Day 1 Afternoon & Evening: Jallianwala Bagh & Wagah Border", content: "Pay respects at historic Jallianwala Bagh, then travel 30 km to Wagah Border for the high-energy Beating Retreat ceremony." },
        { heading: "Day 2 Morning: Partition Museum & Gobindgarh Fort", content: "Explore the moving exhibits at the world's first Partition Museum in Town Hall, followed by 7D shows at Maharaja Ranjit Singh's Gobindgarh Fort." },
        { heading: "Day 2 Afternoon: Legendary Amritsari Food Walk", content: "Feast on crispy butter-drenched Amritsari Kulcha at Ashok Kumar Kulchewala, creamy lassi at Ahuja, and jalebis at Gurdasram." }
      ],
      travelTips: ["Cover your head with a headscarf inside Golden Temple complex.", "Leave bags at home or use stadium lockers for Wagah Border."],
      faqs: [
        { question: "What is the best time to visit Golden Temple?", answer: "At dawn (4:00 AM) or late evening under illuminated night lights." }
      ],
      conclusion: "Amritsar fills your heart with warmth, reverence, and mouthwatering culinary memories."
    }
  },
  {
    title: "4-Day Leh Ladakh Itinerary: Monasteries, Khardung La & Pangong Lake",
    slug: "4-day-leh-ladakh-itinerary-monasteries-khardung-la-and-pangong-lake",
    metaTitle: "4-Day Leh Ladakh Itinerary: Khardung La, Nubra Valley & Pangong",
    metaDescription: "The ultimate 4-day high-altitude adventure itinerary in Ladakh. Acclimatization, Thiksey Monastery, Khardung La Pass, Hunder dunes, and Pangong Lake.",
    keyword: "4 day Leh Ladakh itinerary travel guide",
    publishedDate: new Date("2026-08-10T09:15:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "15 min read",
    heroImage: "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Why is 24-hour acclimatization essential in Leh?", answer: "Leh is located at 11,500 ft; resting on Day 1 prevents acute mountain sickness (AMS)." },
      { question: "Do tourists need an Inner Line Permit (ILP) for Pangong Lake?", answer: "Yes, an online Inner Line Permit is required for Nubra, Pangong, and Changthang regions." }
    ],
    contentJson: {
      title: "4-Day Leh Ladakh Itinerary: Monasteries, Khardung La & Pangong Lake",
      metaTitle: "4-Day Leh Ladakh Itinerary: Khardung La, Nubra Valley & Pangong",
      metaDescription: "The ultimate 4-day high-altitude adventure itinerary in Ladakh. Acclimatization, Thiksey Monastery, Khardung La Pass, Hunder dunes, and Pangong Lake.",
      introduction: "Land of high passes, Ladakh offers majestic snow-draped ranges, ancient cliffside gompas, and turquoise lakes changing colors under high-altitude skies.",
      sections: [
        { heading: "Day 1: Arrival & Mandatory Acclimatization at Leh", content: "Rest completely during the morning. In the evening, take a slow stroll to Shanti Stupa and Leh Main Market." },
        { heading: "Day 2: Hall of Fame, Magnetic Hill & Thiksey Monastery", content: "Visit Hall of Fame war museum, experience Magnetic Hill anomaly, and marvel at 12-story Thiksey Monastery resembling Tibet's Potala Palace." },
        { heading: "Day 3: Crossing Khardung La (17,582 ft) to Nubra Valley", content: "Drive over iconic Khardung La pass to Nubra Valley. Ride double-humped Bactrian camels among white sand dunes at Hunder." },
        { heading: "Day 4: Shyok Route to Pangong Tso & Return to Leh", content: "Drive along Shyok River to magical Pangong Lake (13,940 ft), taking photos along the turquoise shore before returning to Leh over Chang La." }
      ],
      travelTips: ["Drink 3-4 liters of water daily to aid acclimatization.", "Obtain Inner Line Permits online before arriving."],
      faqs: [
        { question: "Why is 24-hour acclimatization essential in Leh?", answer: "To prevent mountain sickness at 11,500 ft altitude." }
      ],
      conclusion: "This 4-day Ladakh itinerary packs the ultimate Trans-Himalayan bucket list experiences."
    }
  },
  {
    title: "The Ultimate 3-Day Manali & Solang Valley Itinerary: Snow, Adventure & Old Manali",
    slug: "the-ultimate-3-day-manali-and-solang-valley-itinerary-snow-adventure-and-old-manali",
    metaTitle: "3-Day Manali Itinerary: Solang Valley, Atal Tunnel & Old Manali",
    metaDescription: "Plan 3 epic days in Manali. Cover Old Manali cafes, Hadimba Temple, Solang Valley paragliding, Atal Tunnel, and Sissu waterfalls.",
    keyword: "3 days Manali itinerary adventure guide",
    publishedDate: new Date("2026-08-11T14:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "How long is the Atal Tunnel drive from Manali?", answer: "The 9.02 km Atal Tunnel connects Manali to Lahaul valley in just 25 minutes." },
      { question: "What are the top activities in Solang Valley?", answer: "Paragliding, zorbing, ropeway rides, and snow skiing during winter." }
    ],
    contentJson: {
      title: "The Ultimate 3-Day Manali & Solang Valley Itinerary: Snow, Adventure & Old Manali",
      metaTitle: "3-Day Manali Itinerary: Solang Valley, Atal Tunnel & Old Manali",
      metaDescription: "Plan 3 epic days in Manali. Cover Old Manali cafes, Hadimba Temple, Solang Valley paragliding, Atal Tunnel, and Sissu waterfalls.",
      introduction: "Manali, nestled along the roaring Beas River in Himachal Pradesh, is India's favorite mountain retreat for adventure lovers, honeymooners, and road trippers.",
      sections: [
        { heading: "Day 1: Hadimba Temple, Cedar Forests & Old Manali Cafe Hopping", content: "Visit 16th-century wooden Hadimba Temple surrounded by giant deodar trees, then spend your afternoon in bohemian Old Manali cafes." },
        { heading: "Day 2: Solang Valley Paragliding & Atal Tunnel to Sissu", content: "Soar through the skies in Solang Valley, then drive through engineering marvel Atal Tunnel to admire Sissu Waterfall in Lahaul." },
        { heading: "Day 3: Vashisht Hot Springs & Mall Road Souvenir Shopping", content: "Dip in natural hot sulfur springs at Vashisht Temple, stroll through Van Vihar park, and shop for Kullu shawls on Mall Road." }
      ],
      travelTips: ["Rent a two-wheeler or local 4x4 for easy mountain exploration.", "Try fresh trout fish and siddu (traditional steamed Himachali bread)."],
      faqs: [
        { question: "How long is Atal Tunnel drive?", answer: "Takes ~25 minutes (9.02 km tunnel)." }
      ],
      conclusion: "Manali delivers thrilling adventure, pine forest solitude, and memorable mountain vistas."
    }
  },
  {
    title: "2 Days in Agra: Taj Mahal Sunrise, Agra Fort & Hidden Sunset Views",
    slug: "2-days-in-agra-taj-mahal-sunrise-agra-fort-and-hidden-sunset-views",
    metaTitle: "2-Day Agra Itinerary: Taj Mahal Sunrise, Agra Fort & Fatehpur Sikri",
    metaDescription: "The complete 48-hour Agra itinerary. Witness Taj Mahal at sunrise, tour Agra Fort, view sunset from Mehtab Bagh, and take a day trip to Fatehpur Sikri.",
    keyword: "2 day Agra itinerary Taj Mahal guide",
    publishedDate: new Date("2026-08-12T08:30:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "11 min read",
    heroImage: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Is Taj Mahal open on Fridays?", answer: "No, Taj Mahal is closed to general tourists every Friday." },
      { question: "Which gate of Taj Mahal has shorter morning queues?", answer: "East Gate generally moves faster for early morning sunrise entries." }
    ],
    contentJson: {
      title: "2 Days in Agra: Taj Mahal Sunrise, Agra Fort & Hidden Sunset Views",
      metaTitle: "2-Day Agra Itinerary: Taj Mahal Sunrise, Agra Fort & Fatehpur Sikri",
      metaDescription: "The complete 48-hour Agra itinerary. Witness Taj Mahal at sunrise, tour Agra Fort, view sunset from Mehtab Bagh, and take a day trip to Fatehpur Sikri.",
      introduction: "Agra, home to the world's most famous monument to love, is a treasure trove of Mughal architectural masterpieces along the Yamuna River.",
      sections: [
        { heading: "Day 1 Morning: Taj Mahal Sunrise Walkthrough", content: "Enter East Gate at 5:30 AM to witness soft golden sunlight illuminate the white marble dome of the Taj Mahal with minimal crowd reflection." },
        { heading: "Day 1 Afternoon & Evening: Agra Fort & Mehtab Bagh Sunset", content: "Tour Jahangiri Mahal inside red sandstone Agra Fort, then cross Yamuna River to Mehtab Bagh garden for a spectacular rear sunset view of the Taj." },
        { heading: "Day 2 Morning: Fatehpur Sikri Excursion", content: "Take a 40 km excursion to Emperor Akbar's abandoned red sandstone capital, entering through massive Buland Darwaza and visiting Sheikh Salim Chishti's shrine." },
        { heading: "Day 2 Afternoon: Mughlai Food Walk & Petha Tasting", content: "Sample famous Agra Petha at Panchhi Petha, followed by rich Mughlai kebabs and butter chicken near Sadar Bazaar." }
      ],
      travelTips: ["Book Taj Mahal tickets online on ASI website to skip ticket window lines.", "Drones and large bags are prohibited inside Taj Mahal grounds."],
      faqs: [
        { question: "Is Taj Mahal open on Fridays?", answer: "No, closed every Friday." }
      ],
      conclusion: "Agra offers an unmissable heritage weekend immersed in Mughal grandeur."
    }
  },
  {
    title: "The Perfect 3-Day Chikmagalur Itinerary: Coffee Estates & Mullayanagiri Peak",
    slug: "the-perfect-3-day-chikmagalur-itinerary-coffee-estates-and-mullayanagiri-peak",
    metaTitle: "3-Day Chikmagalur Itinerary: Mullayanagiri, Hebbe Falls & Plantations",
    metaDescription: "Explore Chikmagalur in 3 days. Trek to Mullayanagiri peak, tour homestay coffee plantations, chase Hebbe & Kalhatti Falls, and visit Baba Budangiri.",
    keyword: "3 days Chikmagalur itinerary travel guide",
    publishedDate: new Date("2026-08-13T12:00:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "How tall is Mullayanagiri Peak?", answer: "At 1,930 meters (6,330 ft), Mullayanagiri is the highest mountain peak in Karnataka." },
      { question: "Can private cars reach Hebbe Falls?", answer: "No, the last 4 km through forest coffee trails requires hiring local 4x4 jeeps." }
    ],
    contentJson: {
      title: "The Perfect 3-Day Chikmagalur Itinerary: Coffee Estates & Mullayanagiri Peak",
      metaTitle: "3-Day Chikmagalur Itinerary: Mullayanagiri, Hebbe Falls & Plantations",
      metaDescription: "Explore Chikmagalur in 3 days. Trek to Mullayanagiri peak, tour homestay coffee plantations, chase Hebbe & Kalhatti Falls, and visit Baba Budangiri.",
      introduction: "Chikmagalur, known as the birthplace of Indian coffee, is a mountain wonderland in Karnataka featuring dark green forest peaks, spice estates, and roaring waterfalls.",
      sections: [
        { heading: "Day 1: Coffee Plantation Check-in & Z Point Sunset Trek", content: "Stay in a traditional coffee estate homestay, learn about Robusta cultivation, and take a sunset hike to Z Point cliff." },
        { heading: "Day 2: Mullayanagiri Peak & Baba Budangiri Caves", content: "Climb the stone steps to Mullayanagiri peak temple, followed by a scenic ridge drive to sacred Baba Budangiri shrines." },
        { heading: "Day 3: 4x4 Safari to Hebbe Falls & Kalhatti Waterfalls", content: "Hop on a 4x4 jeep to reach multi-tiered Hebbe Falls inside private coffee estates, concluding with a dip at Kalhatti Falls." }
      ],
      travelTips: ["Hire local 4x4 jeeps for steep estate tracks.", "Buy fresh filter coffee powder from local roasters."],
      faqs: [
        { question: "How tall is Mullayanagiri Peak?", answer: "1,930 meters (6,330 ft)." }
      ],
      conclusion: "Chikmagalur is the ultimate weekend retreat for mountain trekkers and coffee lovers."
    }
  },
  {
    title: "4-Day Andaman Beach & Coral Reef Itinerary: Havelock, Neil & Port Blair",
    slug: "4-day-andaman-beach-and-coral-reef-itinerary-havelock-neil-and-port-blair",
    metaTitle: "4-Day Andaman Itinerary: Radhanagar Beach, Scuba & Ross Island",
    metaDescription: "Experience 4 tropical days in Andaman islands. Cruise to Havelock, dive at Elephant Beach, explore Neil Island natural bridge, and tour Port Blair.",
    keyword: "4 day Andaman itinerary beach guide",
    publishedDate: new Date("2026-08-14T15:20:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "14 min read",
    heroImage: "https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "Do non-swimmers need experience for scuba diving in Andaman?", answer: "No! PADI discovery scuba dives include personal dive masters for non-swimmers." },
      { question: "How to book inter-island ferry tickets in Andaman?", answer: "Book online on Makruzz or Green Ocean portals 2-3 weeks ahead." }
    ],
    contentJson: {
      title: "4-Day Andaman Beach & Coral Reef Itinerary: Havelock, Neil & Port Blair",
      metaTitle: "4-Day Andaman Itinerary: Radhanagar Beach, Scuba & Ross Island",
      metaDescription: "Experience 4 tropical days in Andaman islands. Cruise to Havelock, dive at Elephant Beach, explore Neil Island natural bridge, and tour Port Blair.",
      introduction: "White sand beaches, crystal turquoise waters, and vibrant marine life await in the Andaman and Nicobar Islands.",
      sections: [
        { heading: "Day 1: Port Blair Arrival, Cellular Jail & Light Show", content: "Arrive in Port Blair, tour national memorial Cellular Jail, and attend evening Light and Sound performance." },
        { heading: "Day 2: High-Speed Ferry to Havelock & Radhanagar Sunset", content: "Cruise 90 minutes to Havelock (Swaraj Dweep). Spend a relaxed afternoon watching sunset at world-famous Radhanagar Beach." },
        { heading: "Day 3: Scuba Diving & Water Sports at Elephant Beach", content: "Take a speed boat to Elephant Beach for scuba diving, sea walking, and snorkeling over living coral gardens." },
        { heading: "Day 4: Neil Island Natural Bridge & Return Cruise", content: "Take a morning ferry to Neil Island (Shaheed Dweep) to see the natural coral rock bridge before departing." }
      ],
      travelTips: ["Carry light cotton clothes, hat, and reef-safe sunscreen.", "Keep physical printed copies of ferry tickets."],
      faqs: [
        { question: "Can non-swimmers do scuba diving?", answer: "Yes, PADI discovery dives include dedicated dive masters." }
      ],
      conclusion: "This 4-day island itinerary promises tropical beach bliss and underwater adventure."
    }
  },
  {
    title: "2-Day Pondicherry Beach & French Heritage Itinerary",
    slug: "2-day-pondicherry-beach-and-french-heritage-itinerary",
    metaTitle: "2-Day Pondicherry Itinerary: White Town, Auroville & Rock Beach",
    metaDescription: "Plan 48 hours in Pondicherry. French quarter heritage walk, Auroville Matrimandir view, oceanfront Promenade stroll, and bakery cafe hopping.",
    keyword: "2 day Pondicherry weekend itinerary",
    publishedDate: new Date("2026-08-15T10:30:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "10 min read",
    heroImage: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "What is the best way to get around Pondicherry?", answer: "Rent a bicycle or yellow scooter for easy navigation through narrow French Quarter streets." },
      { question: "Is vehicle traffic allowed on Rock Beach at night?", answer: "No, Rock Beach Promenade is restricted to pedestrians only every evening from 6:00 PM to 7:30 AM." }
    ],
    contentJson: {
      title: "2-Day Pondicherry Beach & French Heritage Itinerary",
      metaTitle: "2-Day Pondicherry Itinerary: White Town, Auroville & Rock Beach",
      metaDescription: "Plan 48 hours in Pondicherry. French quarter heritage walk, Auroville Matrimandir view, oceanfront Promenade stroll, and bakery cafe hopping.",
      introduction: "Pondicherry offers a charming fusion of French colonial architecture, spiritual peace, and seaside cafes along India's Coromandel coast.",
      sections: [
        { heading: "Day 1 Morning: White Town Heritage Bicycle Tour", content: "Rent a yellow scooter or vintage bicycle to tour mustard-hued colonial mansions, French street signs, and Sri Aurobindo Ashram." },
        { heading: "Day 1 Afternoon & Evening: Cafe Hopping & Rock Beach Promenade", content: "Indulge in French quiches and pain au chocolat, then spend your evening walking along vehicle-free Rock Beach Promenade." },
        { heading: "Day 2 Morning: Auroville Matrimandir & Peace Walk", content: "Drive 12 km to Auroville universal township, walking through tranquil forested paths to view the golden sphere Matrimandir." },
        { heading: "Day 2 Afternoon: Paradise Beach Boat Ride & Departure", content: "Take a backwater boat ride to secluded Paradise Beach before starting your journey home." }
      ],
      travelTips: ["Try wood-fired sourdough pizzas at Coromandel Cafe.", "Wear light linen clothing and sun hats for coastal heat."],
      faqs: [
        { question: "Is vehicle traffic allowed on Rock Beach at night?", answer: "No, restricted to pedestrians after 6:00 PM." }
      ],
      conclusion: "This 2-day Pondicherry itinerary delivers European charm, coastal sea breezes, and relaxation."
    }
  },
  {
    title: "The Ultimate 3-Day Darjeeling Itinerary: Kanchenjunga Sunrise & Tea Gardens",
    slug: "the-ultimate-3-day-darjeeling-itinerary-kanchenjunga-sunrise-and-tea-gardens",
    metaTitle: "3-Day Darjeeling Itinerary: Tiger Hill, Toy Train & Tea Estates",
    metaDescription: "Plan 3 golden days in Darjeeling. Sunrise over Kanchenjunga at Tiger Hill, UNESCO Toy Train ride to Ghoom, Happy Valley tea estate, and Mall Road.",
    keyword: "3 days Darjeeling itinerary tea gardens",
    publishedDate: new Date("2026-08-16T13:45:00.000Z"),
    author: "Weekend Travellers",
    isPublished: true,
    readingTime: "12 min read",
    heroImage: "https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=940",
    images: [
      "https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    faqs: [
      { question: "How to book Darjeeling Toy Train tickets?", answer: "Book joyrides online via IRCTC (station code: DJ for Darjeeling to Ghoom)." },
      { question: "Nearest airport to Darjeeling?", answer: "Bagdogra Airport (IXB), approximately 3 hours (70 km) away by car." }
    ],
    contentJson: {
      title: "The Ultimate 3-Day Darjeeling Itinerary: Kanchenjunga Sunrise & Tea Gardens",
      metaTitle: "3-Day Darjeeling Itinerary: Tiger Hill, Toy Train & Tea Estates",
      metaDescription: "Plan 3 golden days in Darjeeling. Sunrise over Kanchenjunga at Tiger Hill, UNESCO Toy Train ride to Ghoom, Happy Valley tea estate, and Mall Road.",
      introduction: "Framed by the world's third highest mountain (Mount Kanchenjunga), Darjeeling is Queen of the Hills, famous for aromatic tea, mist-shrouded ridges, and historic steam locomotives.",
      sections: [
        { heading: "Day 1: Tiger Hill Sunrise & UNESCO Toy Train Joyride", content: "Wake up at 4:00 AM for Tiger Hill sunrise over Kanchenjunga peaks, followed by a steam toy train ride through Batasia Loop to Ghoom Monastery." },
        { heading: "Day 2: Happy Valley Tea Estate & Himalayan Mountaineering Institute", content: "Tour historic Happy Valley Tea Estate for tea plucking & tasting, then visit Himalayan Mountaineering Institute and Padmaja Naidu Himalayan Zoo (Red Pandas)." },
        { heading: "Day 3: Peace Pagoda, Japanese Temple & Mall Road Stroll", content: "Visit Japanese Peace Pagoda, enjoy panoramic views from Chowrasta (Mall Road), and savor traditional Tibetan momos at Kunga Restaurant." }
      ],
      travelTips: ["Dress in warm layers as morning mountain temperatures drop.", "Buy genuine Muscatel First Flush Darjeeling tea."],
      faqs: [
        { question: "Nearest airport to Darjeeling?", answer: "Bagdogra Airport (IXB), ~3 hours drive." }
      ],
      conclusion: "Darjeeling captures the timeless magic of the Eastern Himalayas."
    }
  },
  {
    title: "48 Hours in Varanasi: Ghats, Evening Aarti & Sarnath Itinerary",
    slug: "48-hours-in-varanasi-ghats-evening-aarti-and-sarnath-itinerary",
    metaTitle: "48-Hour Varanasi Itinerary: Ganga Aarti, Sunrise Boat & Sarnath",
    metaDescription: "Experience the ultimate 2-day trip to Varanasi. Dawn Ganges river boat ride, Kashi Vishwanath Temple, Dashashwamedh Aarti, and Sarnath day trip.",
    keyword: "48 hours Varanasi itinerary travel guide",
    publishedDate: new Date("2026-08-17T09:00:00.000Z"),
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
      { question: "What is Sarnath famous for?", answer: "Sarnath is where Lord Buddha gave his first sermon (Dhamek Stupa) after attaining enlightenment." },
      { question: "How to book a private boat for Ganges sunrise?", answer: "Negotiate directly with boatmen at Assi Ghat or Dashashwamedh Ghat the evening prior." }
    ],
    contentJson: {
      title: "48 Hours in Varanasi: Ghats, Evening Aarti & Sarnath Itinerary",
      metaTitle: "48-Hour Varanasi Itinerary: Ganga Aarti, Sunrise Boat & Sarnath",
      metaDescription: "Experience the ultimate 2-day trip to Varanasi. Dawn Ganges river boat ride, Kashi Vishwanath Temple, Dashashwamedh Aarti, and Sarnath day trip.",
      introduction: "Varanasi (Banaras) is a spiritual powerhouse on the banks of the sacred River Ganges. This 48-hour itinerary guides you through ancient rituals, historic temples, and legendary street food.",
      sections: [
        { heading: "Day 1 Morning: Sunrise Rowboat Ride & Kashi Vishwanath", content: "Glide past 88 river ghats at dawn from Assi Ghat to Manikarnika Ghat, followed by a visit to sacred Kashi Vishwanath Corridor." },
        { heading: "Day 1 Evening: Dashashwamedh Ganga Aarti & Street Food", content: "Watch brass lamp rituals at Dashashwamedh Ghat, then sample famous Tamatar Chaat and Malaiyo dessert." },
        { heading: "Day 2 Morning: Sarnath Buddhist Heritage Excursion", content: "Travel 10 km to historic Sarnath to explore Dhamek Stupa, Ashoka Pillar capital, and peaceful monasteries." },
        { heading: "Day 2 Afternoon: Banarasi Silk Weaving & Sunset Boat Walk", content: "Visit traditional handloom silk weaving quarters in Madanpura, finishing with a relaxed evening walk along Assi Ghat." }
      ],
      travelTips: ["Dress modestly and leave leather items outside temple corridors.", "Stay in heritage ghat-facing hotels."],
      faqs: [
        { question: "What is Sarnath famous for?", answer: "Lord Buddha's first sermon site." }
      ],
      conclusion: "48 hours in Varanasi offers an unforgettable spiritual and cultural experience."
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

    console.log(`\n🎉 Successfully seeded ${insertedCount} Itineraries blog posts into MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding blog posts:", err);
    process.exit(1);
  }
}

seed();
