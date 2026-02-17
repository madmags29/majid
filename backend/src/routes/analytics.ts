import express from 'express';
import { Analytics } from '../models/Analytics';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { authenticateAdmin } from '../middleware/auth';
import { analyzeAnalyticsData } from '../services/ai';

const router = express.Router();

// Helper to determine source
const determineSource = (referrer: string, utmSource?: string, utmMedium?: string): string => {
    if (utmSource === 'google' || utmSource === 'bing') return 'Paid Search';
    if (utmMedium === 'cpc' || utmMedium === 'paid') return 'Paid Search';
    if (utmMedium === 'social') return 'Organic Social';
    if (referrer) {
        if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) return 'Organic Search';
        if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram') || referrer.includes('linkedin')) return 'Organic Social';
        return 'Referral';
    }
    return 'Direct';
};

// TRACK ENDPOINT
router.post('/analytics/track', async (req, res) => {
    try {
        const { visitorId, sessionId, userId, path, action, metadata, duration, referrer, ip } = req.body;

        const userIp = ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const country = req.body.country || 'Unknown';
        const city = req.body.city || 'Unknown';

        const source = determineSource(referrer, metadata?.utm_source, metadata?.utm_medium);

        let cleanUserId = undefined;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            cleanUserId = userId;
        }

        const analyticsEntry = new Analytics({
            visitorId,
            sessionId,
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
        res.status(200).json({ success: false });
    }
});

// DASHBOARD DATA ENDPOINT
router.get('/analytics/dashboard', authenticateAdmin, async (req, res) => {
    try {
        const now = new Date();
        const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // 1. Realtime Users (Active in last 5 minutes)
        const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const realtimeUsersCount = await Analytics.distinct('visitorId', {
            timestamp: { $gte: fiveMinAgo }
        }).then(ids => ids.length);

        // 2. 30 Min Activity
        const activity30Min = await Analytics.countDocuments({
            timestamp: { $gte: thirtyMinAgo },
            action: 'pageview'
        });

        // 3. User Engagement Time
        const engagementStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$visitorId", totalDuration: { $sum: "$duration" } } },
            { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } }
        ]);
        const avgEngagementTime = engagementStats.length > 0 ? Math.round(engagementStats[0].avgDuration) : 0;

        // 4. Traffic Sources
        const trafficSources = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo }, action: 'pageview' } },
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // 5. Conversions
        const searchCount = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'search'
        });
        const itineraryCount = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'itinerary_generate'
        });
        const conversionRate = searchCount > 0 ? Math.round((itineraryCount / searchCount) * 100) : 0;

        // 6. Registered Users
        const totalUsers = await User.countDocuments();
        const newUsers24h = await User.countDocuments({
            createdAt: { $gte: twentyFourHoursAgo }
        });

        // 7. Recent Activity
        const recentActivity = await Analytics.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .select('path action timestamp country source');

        // 8. Top Destinations
        const topDestinations = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo }, action: 'search' } },
            { $group: { _id: "$metadata.destination", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 9. Country Stats
        const countryStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            realtimeUsers: realtimeUsersCount,
            activity30Min,
            avgEngagementTime,
            trafficSources,
            totalUsers,
            newUsers24h,
            recentActivity,
            topDestinations,
            conversionRate,
            countryStats,
            funnel: {
                search: searchCount,
                itinerary: itineraryCount
            }
        });

    } catch (error) {
        console.error('Dashboard Data Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// AI INSIGHTS ENDPOINT
router.get('/analytics/ai-insights', authenticateAdmin, async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Fetch metrics for AI analysis
        const totalPageviews = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'pageview'
        });

        const uniqueVisitors = await Analytics.distinct('visitorId', {
            timestamp: { $gte: twentyFourHoursAgo }
        }).then(ids => ids.length);

        const trafficSources = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo }, action: 'pageview' } },
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        const topDestinations = await Analytics.aggregate([
            { $match: { action: 'search', timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$metadata.destination", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const countryStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const searchCount = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'search'
        });
        const itineraryCount = await Analytics.countDocuments({
            timestamp: { $gte: twentyFourHoursAgo },
            action: 'itinerary_generate'
        });
        const conversionRate = searchCount > 0 ? ((itineraryCount / searchCount) * 100).toFixed(1) : "0";

        const engagementStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
            { $group: { _id: "$visitorId", totalDuration: { $sum: "$duration" } } },
            { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } }
        ]);
        const avgEngagementTime = engagementStats.length > 0 ? Math.round(engagementStats[0].avgDuration) : 0;

        const aiInsights = await analyzeAnalyticsData({
            totalPageviews,
            uniqueVisitors,
            topDestinations,
            conversionRate,
            avgEngagementTime,
            trafficSources,
            countryStats
        });

        res.json(aiInsights);
    } catch (error) {
        console.error('AI Insights Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
