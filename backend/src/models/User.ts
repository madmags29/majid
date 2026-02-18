import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function (this: any) { return !this.googleId && !this.facebookId && !this.appleId; }, // Password required only if not social login
    },
    name: {
        type: String,
        required: true,
    },
    googleId: { type: String },
    facebookId: { type: String },
    appleId: { type: String },
    picture: { type: String },
    isAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
    phone: { type: String },
    location: { type: String },
    device: { type: String },
    lastActive: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

// Indexes for Admin Dashboard searches and filters
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);
