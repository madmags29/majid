import express from 'express';
import { Analytics } from '../models/Analytics';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Helper to determine source
const determineSource = (referrer: string, utmSource?: string, utmMedium?: string): string => {
    if (utmSource === 'google' || utmSource === 'bing') return 'Paid Search'; // Simplified logic
    if (utmMedium === 'cpc' || utmMedium === 'paid') return 'Paid Search';
    if (utmMedium === 'social') return 'Organic Social';
    if (referrer) {
        if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) return 'Organic Search';
        if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram') || referrer.includes('linkedin')) return 'Organic Social';
        return 'Referral';
    }
    return 'Direct'; // Default or Unassigned could be used if strictly direct
};

// TRACK ENDPOINT
router.post('/analytics/track', async (req, res) => {
    try {
        const { visitorId, userId, path, action, metadata, duration, referrer, ip } = req.body;

        // Use provided IP or extract from request
        const userIp = ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Basic GeoIP (Mocked for now, or use a library like ip-api or maxmind in production)
        // For this implementation, we will accept country/city from frontend if provided (e.g. via timezone or browser API) 
        // OR just store IP and process later. Let's assume frontend sends basic locale or we rely on IP.
        const country = req.body.country || 'Unknown';
        const city = req.body.city || 'Unknown';

        const source = determineSource(referrer, metadata?.utm_source, metadata?.utm_medium);

        // Standardize userId if present
        let cleanUserId = undefined;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            cleanUserId = userId;
        }

        const analyticsEntry = new Analytics({
            visitorId,
            userId: cleanUserId,
            ip: userIp as string,
            country,
            city,
            userAgent: req.headers['user-agent'],
            path,
            action,
            metadata,
            source,
            duration: duration || 0
        });

        await analyticsEntry.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Tracking Error:', error);
        // Don't block client with error, just log it
        res.status(200).json({ success: false });
    }
});

// DASHBOARD DATA ENDPOINT
router.get('/analytics/dashboard', authenticateAdmin, async (req, res) => {
    try {
        // Time ranges
        const now = new Date();
        const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // 1. Realtime Users (Active in last 5 minutes)
        const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const realtimeUsersCount = await Analytics.distinct('visitorId', {
            timestamp: { $gte: fiveMinAgo }
        }).then(ids => ids.length);

        // 2. 30 Min Activity (Pageviews)
        const activity30Min = await Analytics.countDocuments({
            timestamp: { $gte: thirtyMinAgo },
            action: 'pageview'
        });

        // 3. User Engagement Time (Average duration of sessions in last 24h - simplified)
        // Group by visitorId, sum durations
        const engagementStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$visitorId", totalDuration: { $sum: "$duration" } } },
            { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } }
        ]);
        const avgEngagementTime = engagementStats.length > 0 ? Math.round(engagementStats[0].avgDuration) : 0;

        // 4. Traffic Sources (Last 24h)
        const trafficSources = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo }, action: 'pageview' } },
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // 5. Form Submitted Count (Last 24h)
        const formsSubmitted = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'form_submit'
        });

        // 6. Registered Users (Total & New in last 24h)
        const totalUsers = await User.countDocuments();
        // Assuming User model has createdAt, if not we skip 24h new users or assume strict ID order slightly
        // Let's check User Schema later. For now, we return total.

        // 7. Recent Activity List
        const recentActivity = await Analytics.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .select('path action timestamp country source');

        // 8. User Country Distribution
        const countryStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            realtimeUsers: realtimeUsersCount,
            activity30Min,
            avgEngagementTime, // in seconds
            trafficSources,
            formsSubmitted,
            totalUsers,
            recentActivity,
            countryStats
        });

    } catch (error) {
        console.error('Dashboard Data Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
