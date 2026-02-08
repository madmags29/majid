import mongoose from 'mongoose';
import { CacheStore } from '../services/store';

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

const MongoCache = mongoose.models.Cache || mongoose.model('Cache', CacheSchema);

export default new Proxy(MongoCache, {
    construct(target, args) {
        if (mongoose.connection.readyState === 1) {
            return new (target as any)(...args);
        }
        return CacheStore.createModel(args[0]) as any;
    },
    get(target, prop) {
        if (mongoose.connection.readyState === 1) {
            return (target as any)[prop];
        }
        if (prop === 'findOne') return (query: any) => CacheStore.findOne(query);
        if (prop === 'findOneAndUpdate') return (query: any, update: any, options: any) => CacheStore.findOneAndUpdate(query, update, options);
        return (target as any)[prop];
    }
});
