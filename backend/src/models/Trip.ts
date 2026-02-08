import mongoose from 'mongoose';

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

// Compound index to prevent duplicate saves of same destination for same user (optional)
tripSchema.index({ userId: 1, destination: 1 }, { unique: false });

export const Trip = mongoose.model('Trip', tripSchema);
