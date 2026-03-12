import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join('/tmp', 'blog-cron.log');

export const log = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
    console.log(message);
};
