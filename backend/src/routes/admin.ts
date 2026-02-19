import express from 'express';
import { User } from '../models/User';
import { UserSession, ActivityLog, AIRequest, RevenueRecord, SystemLog } from '../models/Analytics';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply adminAuth to all routes in this router
router.use(adminAuth);

// 1. OVERVIEW STATS
router.get('/stats/overview', async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            usersToday,
            users7d,
            users30d,
            activeUsers,
            totalTrips,
            trips30d
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: today } }),
            User.countDocuments({ createdAt: { $gte: weekAgo } }),
            User.countDocuments({ createdAt: { $gte: monthAgo } }),
            UserSession.countDocuments({ endTime: { $exists: false }, startTime: { $gte: new Date(Date.now() - 30 * 60 * 1000) } }),
            ActivityLog.countDocuments({ type: 'trip_search' }),
            ActivityLog.countDocuments({ type: 'trip_search', timestamp: { $gte: monthAgo } })
        ]);

        res.json({
            users: { total: totalUsers, today: usersToday, '7d': users7d, '30d': users30d },
            activeUsers,
            trips: { total: totalTrips, '30d': trips30d },
            conversionRate: totalUsers > 0 ? (totalTrips / totalUsers * 100).toFixed(2) : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching overview stats' });
    }
});

// 2. USER MANAGEMENT
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const query: any = {};

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;

        const users = await User.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.patch('/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Active', 'Blocked'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        await User.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: `User status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// 3. AI USAGE
router.get('/stats/ai', async (req, res) => {
    try {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const stats = await AIRequest.aggregate([
            { $match: { timestamp: { $gte: monthAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: "$responseTime" },
                    failed: { $sum: { $cond: [{ $eq: ["$status", "fail"] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalRequests = await AIRequest.countDocuments();
        const failRate = totalRequests > 0 ? (await AIRequest.countDocuments({ status: 'fail' }) / totalRequests * 100) : 0;

        res.json({
            dailyStats: stats,
            summary: {
                totalRequests,
                failRate: failRate.toFixed(2),
                avgResponseTime: stats.length > 0 ? stats[0].avgResponseTime : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching AI stats' });
    }
});

// 5. ACTIVITY TRACKING
router.get('/tracking/activities', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 50;
        const activities = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('userId', 'name email picture');

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities' });
    }
});

router.get('/tracking/sessions', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 50;
        const sessions = await UserSession.find()
            .sort({ startTime: -1 })
            .limit(limit)
            .populate('userId', 'name email');

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions' });
    }
});

// 6. SYSTEM MONITORING
router.get('/logs', async (req, res) => {
    try {
        const { level, context, limit = 50 } = req.query;
        const query: any = {};
        if (level) query.level = level;
        if (context) query.context = context;

        const logs = await SystemLog.find(query)
            .sort({ timestamp: -1 })
            .limit(Number(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// 7. REVENUE DASHBOARD
router.get('/stats/revenue', async (req, res) => {
    try {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const revenue = await RevenueRecord.aggregate([
            { $match: { timestamp: { $gte: monthAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalRevenue = await RevenueRecord.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const bySource = await RevenueRecord.aggregate([
            {
                $group: {
                    _id: "$source",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        res.json({
            dailyRevenue: revenue,
            total: totalRevenue[0]?.total || 0,
            bySource
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching revenue stats' });
    }
});

// 8. SEO ANALYTICS
router.get('/stats/seo', async (req, res) => {
    try {
        // Top Pages
        const topPages = await ActivityLog.aggregate([
            { $match: { type: 'page_view' } },
            { $group: { _id: "$page", views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        // Traffic Sources (referrers from sessions)
        const sources = await UserSession.aggregate([
            { $group: { _id: "$referrer", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ topPages, sources });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching SEO stats' });
    }
});

// 9. SECURITY & COMPLIANCE
router.get('/stats/security', async (req, res) => {
    try {
        const failedLogins = await SystemLog.countDocuments({
            level: 'warn',
            context: 'AUTH',
            message: /failed/i
        });

        const recentThreats = await SystemLog.find({ level: 'error', context: 'SECURITY' })
            .sort({ timestamp: -1 })
            .limit(10);

        res.json({
            failedLogins,
            threats: recentThreats,
            securityScore: Math.max(0, 100 - (failedLogins * 2)) // Simple mock score logic
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching security stats' });
    }
});

export default router;
