import mongoose from 'mongoose';

const CacheSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index based on the value of expiresAt
    }
}, {
    timestamps: true
});

export default mongoose.models.Cache || mongoose.model('Cache', CacheSchema);
