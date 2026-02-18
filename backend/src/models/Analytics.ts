import mongoose, { Schema } from 'mongoose';

// 1. UserSession Model
const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number }, // in seconds
    device: { type: String },
    location: { type: String },
    referrer: { type: String },
    ip: { type: String },
    userAgent: { type: String },
});
sessionSchema.index({ startTime: -1 });

export const UserSession = mongoose.model('UserSession', sessionSchema);

// 2. ActivityLog Model
const activityLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'UserSession', index: true },
    type: {
        type: String,
        enum: ['page_view', 'trip_search', 'trip_view', 'trip_save', 'contact_submit'],
        required: true,
        index: true
    },
    page: { type: String },
    details: { type: Schema.Types.Mixed }, // Stores destination, budget, etc.
    timestamp: { type: Date, default: Date.now, index: true },
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// 3. AIRequest Model
const aiRequestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    requestType: { type: String, required: true },
    prompt: { type: String },
    response: { type: String },
    responseTime: { type: Number }, // in ms
    status: { type: String, enum: ['success', 'fail'], default: 'success', index: true },
    error: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
});

export const AIRequest = mongoose.model('AIRequest', aiRequestSchema);

// 4. RevenueRecord Model
const revenueRecordSchema = new Schema({
    type: { type: String, enum: ['affiliate', 'ad', 'subscription'], required: true, index: true },
    amount: { type: Number, required: true },
    source: { type: String }, // e.g. "Travelpayouts"
    destination: { type: String }, // e.g. "Paris"
    page: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    timestamp: { type: Date, default: Date.now, index: true },
});

export const RevenueRecord = mongoose.model('RevenueRecord', revenueRecordSchema);

// 5. SystemLog Model
const systemLogSchema = new Schema({
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info', index: true },
    message: { type: String, required: true },
    context: { type: String }, // e.g. "API", "Database"
    stack: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
});

export const SystemLog = mongoose.model('SystemLog', systemLogSchema);
