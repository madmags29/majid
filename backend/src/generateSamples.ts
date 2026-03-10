import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlogKeyword } from './models/BlogKeyword';
import { processManualBlogGeneration } from './services/blogService';

dotenv.config();

async function generateSampleBlogs() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    const keywords = await BlogKeyword.find({ used: false }).limit(3);
    
    if (keywords.length === 0) {
      console.log('No unused keywords found.');
      return;
    }

    for (const kw of keywords) {
      console.log(`Generating blog for: ${kw.keyword}`);
      await processManualBlogGeneration(kw.keyword);
      kw.used = true;
      kw.usedAt = new Date();
      await kw.save();
      console.log(`Finished: ${kw.keyword}`);
    }

    console.log('Sample blog generation completed!');
  } catch (error) {
    console.error('Error generating sample blogs:', error);
  } finally {
    await mongoose.connection.close();
  }
}

generateSampleBlogs();
