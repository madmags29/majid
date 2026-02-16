import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
    visitorId: string;
    userId?: string;
    ip?: string;
    country?: string;
    city?: string;
    userAgent?: string;
    path: string;
    action: 'pageview' | 'heartbeat' | 'event' | 'form_submit';
    metadata?: any;
    timestamp: Date;
    duration?: number; // duration on page in seconds (for heartbeats)
    source?: 'Direct' | 'Referral' | 'Organic Search' | 'Paid Search' | 'Organic Social' | 'Unassigned';
}

const AnalyticsSchema: Schema = new Schema({
    visitorId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    ip: { type: String },
    country: { type: String },
    city: { type: String },
    userAgent: { type: String },
    path: { type: String, required: true },
    action: { type: String, enum: ['pageview', 'heartbeat', 'event', 'form_submit'], default: 'pageview' },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
    duration: { type: Number, default: 0 },
    source: { type: String, default: 'Direct' }
});

// Indexes for common queries
AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ action: 1, timestamp: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
