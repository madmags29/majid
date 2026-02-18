import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: function (this: any) { return !this.googleId && !this.facebookId && !this.appleId; },
    },
    name: {
        type: String,
        required: true,
    },
    googleId: { type: String, index: true },
    facebookId: { type: String, index: true },
    appleId: { type: String, index: true },
    picture: { type: String },
    isAdmin: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active', index: true },
    location: { type: String },
    device: { type: String },
    lastActive: { type: Date, default: Date.now },
    tripsGenerated: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

export const User = mongoose.model('User', userSchema);
