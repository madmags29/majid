// Blog auto-publish cron is now handled by Vercel Cron Jobs.
// See: backend/api/generate-cron.ts and backend/vercel.json
//
// The node-cron approach does not work on Vercel serverless
// because there is no persistent process to keep the scheduler alive.
//
// Keeping this file for reference / local development use only.

import cron from 'node-cron';
import { automateDailyPublish } from '../services/blogService';
import { log } from '../utils/logger';

/**
 * @deprecated Use Vercel Cron Jobs instead (api/generate-cron.ts).
 * This only works when running the backend as a persistent Node.js process (local dev).
 */
export const initBlogCron = () => {
    log('Blog auto-publish cron initializing (local dev only)...');
    
    cron.schedule('0 1 * * *', async () => {
        log('Running scheduled daily blog auto-publish job (1:00 AM)...');
        try {
            await automateDailyPublish(5);
            log('Daily blog auto-publish job completed successfully');
        } catch (error: any) {
            log(`Daily blog auto-publish job failed: ${error.message}`);
        }
    });

    log('Blog auto-publish cron initialized (local dev) - scheduled for 1:00 AM daily');
};
