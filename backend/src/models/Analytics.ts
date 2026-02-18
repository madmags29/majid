import mongoose, { Schema, Document } from 'mongoose';

// --- User Activity Tracking ---
export interface IActivityLog extends Document {
    userId?: mongoose.Types.ObjectId;
    sessionId: string;
    page: string;
    timeSpent: number; // in seconds
    referrer?: string;
    device?: string;
    location?: string;
    timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, required: true, index: true },
    page: { type: String, required: true },
    timeSpent: { type: Number, default: 0 },
    referrer: { type: String },
    device: { type: String },
    location: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
});

// --- AI Usage Monitoring ---
export interface IAIRequestLog extends Document {
    prompt: string;
    destination?: string;
    responseTime: number; // in ms
    status: 'success' | 'failed';
    error?: string;
    userId?: mongoose.Types.ObjectId;
    timestamp: Date;
}

const AIRequestLogSchema: Schema = new Schema({
    prompt: { type: String, required: true },
    destination: { type: String, index: true },
    responseTime: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true, index: true },
    error: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    timestamp: { type: Date, default: Date.now, index: true },
});

// --- Traffic & Conversion Funnel ---
export interface ITrafficSource extends Document {
    source: 'Organic' | 'Paid' | 'Direct' | 'Social' | 'Referral';
    medium?: string;
    campaign?: string;
    sessionId: string;
    path: string;
    isConversion: boolean; // Visitor -> Search -> View -> Save -> Contact
    conversionType?: string;
    timestamp: Date;
}

const TrafficSourceSchema: Schema = new Schema({
    source: { type: String, required: true, index: true },
    medium: { type: String },
    campaign: { type: String },
    sessionId: { type: String, required: true, index: true },
    path: { type: String, required: true },
    isConversion: { type: Boolean, default: false, index: true },
    conversionType: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
});

// --- Revenue Records ---
export interface IRevenueRecord extends Document {
    type: 'Affiliate' | 'Ad' | 'Subscription';
    amount: number;
    currency: string;
    source: string; // e.g., 'Travelpayouts', 'Google Ads'
    destination?: string;
    userId?: mongoose.Types.ObjectId;
    timestamp: Date;
}

const RevenueRecordSchema: Schema = new Schema({
    type: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    source: { type: String, required: true, index: true },
    destination: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now, index: true },
});

// --- System & Error Logs ---
export interface ISystemLog extends Document {
    level: 'info' | 'warn' | 'error';
    message: string;
    stack?: string;
    context?: string; // e.g., 'API', 'Database', 'Server'
    latency?: number;
    statusCode?: number;
    timestamp: Date;
}

const SystemLogSchema: Schema = new Schema({
    level: { type: String, required: true, index: true },
    message: { type: String, required: true },
    stack: { type: String },
    context: { type: String, index: true },
    latency: { type: Number },
    statusCode: { type: Number },
    timestamp: { type: Date, default: Date.now, index: true },
});

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export const AIRequestLog = mongoose.model<IAIRequestLog>('AIRequestLog', AIRequestLogSchema);
export const TrafficSource = mongoose.model<ITrafficSource>('TrafficSource', TrafficSourceSchema);
export const RevenueRecord = mongoose.model<IRevenueRecord>('RevenueRecord', RevenueRecordSchema);
export const SystemLog = mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);
