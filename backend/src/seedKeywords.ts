import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlogKeyword } from './models/BlogKeyword';

dotenv.config();

const keywords = [
  "Best weekend trips from Delhi",
  "Hidden places near Delhi",
  "Best hill stations near Delhi",
  "Budget weekend trips India",
  "Best road trips from Delhi",
  "Best trekking places near Delhi",
  "Camping places near Delhi",
  "Romantic weekend getaways near Delhi",
  "Best winter destinations India",
  "Best monsoon destinations India",
  "Best summer hill stations India",
  "Best solo travel destinations India",
  "Best adventure trips India",
  "Best scenic drives India",
  "Best waterfalls near Delhi",
  "Best national parks near Delhi",
  "Delhi to Rishikesh road trip",
  "Delhi to Jaipur road trip",
  "Delhi to Manali road trip",
  "Delhi to Shimla road trip",
  "Weekend travel packing checklist",
  "How to plan a weekend trip",
  "Budget travel tips India",
  "Top hidden travel destinations India",
  "Ultimate India travel guide",
  "Mystical ruins of Hampi guide",
  "Varanasi spiritual travel experience",
  "Goa beyond beaches: hidden gems",
  "South India temple tour guide",
  "Backpacking through Rajasthan",
  "Kerala backwaters: a peaceful retreat",
  "Majestical Ladakh road trip guide",
  "Spiti Valley travel tips",
  "Exploring the Northeast: Meghalaya guide",
  "Sikkim: The hidden jewel of East India",
  "Kashmir: Heaven on earth guide",
  "Agra: Beyond the Taj Mahal",
  "Mumbai local food trail",
  "Pondicherry: The French capital of India",
  "Western Ghats: A biodiversity hotspot",
  "Indian wildlife safari: Top tiger reserves",
  "Hill stations of South India",
  "East India's cultural capital: Kolkata",
  "Ancient caves of Ajanta and Ellora",
  "Rann of Kutch: The white desert guide",
  "Udaipur: The city of lakes guide",
  "Coffee plantations of Coorg travel",
  "Andaman Islands: Tropical paradise guide",
  "Exploring the ruins of Nalanda",
  "Indian pilgrimage: Char Dham Yatra tips"
];

async function seedKeywords() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const kw of keywords) {
      const exists = await BlogKeyword.findOne({ keyword: kw });
      if (!exists) {
        await new BlogKeyword({ keyword: kw }).save();
        console.log(`Seeded: ${kw}`);
      }
    }

    console.log('Keyword seeding completed!');
  } catch (error) {
    console.error('Error seeding keywords:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedKeywords();
