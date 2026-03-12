import cron from 'node-cron';
import { automateDailyPublish } from '../services/blogService';
import { log } from '../utils/logger';

export const initBlogCron = () => {
    log('Blog auto-publish cron initializing...');
    
    // Original daily at 1:00 AM
    cron.schedule('0 1 * * *', async () => {
        log('Running scheduled daily blog auto-publish job (1:00 AM)...');
        try {
            await automateDailyPublish(5);
            log('Daily blog auto-publish job completed successfully');
        } catch (error: any) {
            log(`Daily blog auto-publish job failed: ${error.message}`);
        }
    });

    log('Blog auto-publish cron initialized and scheduled for 1:00 AM daily');
};
