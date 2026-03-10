import cron from 'node-cron';
import { automateDailyPublish } from '../services/blogService';

export const initBlogCron = () => {
    // Run daily at 1:00 AM
    cron.schedule('0 1 * * *', async () => {
        console.log('Running daily blog auto-publish job...');
        try {
            await automateDailyPublish();
        } catch (error) {
            console.error('Daily blog auto-publish job failed:', error);
        }
    });

    console.log('Blog auto-publish cron initialized');
};
