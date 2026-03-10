import cron from 'node-cron';
import { BlogKeyword } from '../models/BlogKeyword';
import { processManualBlogGeneration } from '../services/blogService';

export function setupBlogCron() {
  // Run every day at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('--- STARTING DAILY BLOG AUTO-PUBLISH ---');
    try {
      // Find the next unused keyword
      const keywordEntry = await BlogKeyword.findOne({ used: false }).sort({ createdAt: 1 });

      if (keywordEntry) {
        console.log(`Generating blog for keyword: ${keywordEntry.keyword}`);
        await processManualBlogGeneration(keywordEntry.keyword);
        
        // Mark as used
        keywordEntry.used = true;
        keywordEntry.usedAt = new Date();
        await keywordEntry.save();
        
        console.log(`Successfully published blog for: ${keywordEntry.keyword}`);
      } else {
        console.log('No unused keywords found in the queue.');
      }
    } catch (error) {
      console.error('CRITICAL ERROR in Blog Cron Job:', error);
    }
    console.log('--- END DAILY BLOG AUTO-PUBLISH ---');
  });
  
  console.log('Blog Auto-Publish Cron Job Scheduled (3:00 AM Daily)');
}
