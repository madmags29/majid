import mongoose from 'mongoose';
import { TripStore } from '../services/store';

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    startDate: Date,
    endDate: Date,
    itinerary: {
        type: Object, // Store the full itinerary JSON
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

tripSchema.index({ userId: 1, destination: 1 }, { unique: false });

const MongoTrip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

class InMemoryTripClass {
    constructor(data: any) {
        return TripStore.createModel(data);
    }
}

export const Trip = new Proxy(MongoTrip, {
    construct(target, args) {
        if (mongoose.connection.readyState === 1) {
            return new (target as any)(...args);
        }
        return new (InMemoryTripClass as any)(...args);
    },
    get(target, prop) {
        if (mongoose.connection.readyState === 1) {
            return (target as any)[prop];
        }
        if (prop === 'find') return (query: any) => ({ sort: () => TripStore.find(query) }); // Mock chainable sort
        if (prop === 'findOne') return (query: any) => TripStore.findOne(query);
        if (prop === 'deleteOne') return (query: any) => TripStore.deleteOne(query);
        return (target as any)[prop];
    }
});
