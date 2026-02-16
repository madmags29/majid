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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

export const User = mongoose.model('User', userSchema);
