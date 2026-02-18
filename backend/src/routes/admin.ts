import express from 'express';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';
import { ActivityLog, AIRequestLog, TrafficSource, RevenueRecord, SystemLog } from '../models/Analytics';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// --- SECURITY HARDENING ---

// Rate limiting for admin routes
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply limiter to all admin routes
router.use(adminLimiter);

// --- USER MANAGEMENT ---

// List users with pagination and search
router.get('/users', adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Block/Unblock user
router.patch('/users/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Log audit
        await logAudit((req as any).user?._id || 'unknown', 'update_user_status', `User ${user.email} set to ${status}`);

        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- OVERVIEW DASHBOARD (KPIs) ---

router.get('/stats/overview', adminAuth, async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const totalUsers = await User.countDocuments();
        const todayNewUsers = await User.countDocuments({ createdAt: { $gte: startOfDay } });
        const sevenDaysNewUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        // Active Users (last 5 mins)
        const activeUsersCount = await ActivityLog.distinct('userId', {
            timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
        }).countDocuments();

        const totalAISearches = await AIRequestLog.countDocuments({ timestamp: { $gte: thirtyDaysAgo } });

        const totalRevenue = await RevenueRecord.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    today: todayNewUsers,
                    sevenDays: sevenDaysNewUsers,
                    activeNow: activeUsersCount
                },
                ai: {
                    totalSearches30d: totalAISearches
                },
                revenue: {
                    total30d: totalRevenue[0]?.total || 0
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- TRACKING ---

router.post('/track/pageview', async (req, res) => {
    try {
        const { sessionId, userId, page, referrer, device } = req.body;

        await ActivityLog.create({
            sessionId,
            userId,
            page,
            referrer,
            device,
            timestamp: new Date()
        });

        // Update user's lastActive if userId provided
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                lastActive: new Date(),
                device // Standardize device on user object
            });
        }

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- ANALYTICS ---

// Activity Timeline
router.get('/tracking/activity', adminAuth, async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .populate('userId', 'name')
            .sort({ timestamp: -1 })
            .limit(50);
        res.json({ success: true, data: activities });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// AI Usage Stats
router.get('/ai/stats', adminAuth, async (req, res) => {
    try {
        const stats = await AIRequestLog.aggregate([
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    avgResponseTime: { $avg: '$responseTime' },
                    successRate: { $avg: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } }
                }
            }
        ]);

        const recentRequests = await AIRequestLog.find().sort({ timestamp: -1 }).limit(20);

        res.json({ success: true, data: { summary: stats[0], recent: recentRequests } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Traffic Stats
router.get('/traffic/stats', adminAuth, async (req, res) => {
    try {
        const sources = await TrafficSource.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 }, conversions: { $sum: { $cond: ['$isConversion', 1, 0] } } } }
        ]);
        res.json({ success: true, data: sources });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- REVENUE ---
router.get('/revenue/stats', adminAuth, async (req, res) => {
    try {
        const records = await RevenueRecord.find().sort({ timestamp: -1 }).limit(50);
        const total = await RevenueRecord.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        res.json({ success: true, data: { records, summary: total[0] || { total: 0 } } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- FUNNEL & GEO ---

// Conversion Funnel Data
router.get('/funnel/stats', adminAuth, async (req, res) => {
    try {
        const totalVisitors = await TrafficSource.countDocuments();
        const searches = await ActivityLog.countDocuments({ action: 'search' });
        const savedTrips = await TrafficSource.countDocuments({ isConversion: true, conversionType: { $ne: 'Contact Lead' } });
        const leads = await TrafficSource.countDocuments({ conversionType: 'Contact Lead' });

        res.json({
            success: true,
            data: [
                { step: 'Visitors', count: totalVisitors },
                { step: 'Searches', count: searches },
                { step: 'Saved Trips', count: savedTrips },
                { step: 'Leads', count: leads }
            ]
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Geo Breakdown
router.get('/geo/stats', adminAuth, async (req, res) => {
    try {
        const stats = await User.aggregate([
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({ success: true, data: stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- SECURITY & AUDIT ---

// Audit Logs
router.get('/security/audit', adminAuth, async (req, res) => {
    try {
        const logs = await SystemLog.find({ level: 'audit' }).sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, data: logs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Helper to log admin actions
const logAudit = async (adminId: string, action: string, details: string) => {
    await SystemLog.create({
        level: 'audit',
        message: `Admin ${adminId}: ${action} - ${details}`,
        timestamp: new Date()
    });
};

// --- SYSTEM MONITORING ---
router.get('/system/logs', adminAuth, async (req, res) => {
    try {
        const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, data: logs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
