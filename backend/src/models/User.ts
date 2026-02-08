import mongoose from 'mongoose';
import { UserStore } from '../services/store';

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
});

// Proxy to handle 'new User()' calls from existing code if possible, 
// or simpler: just change the calling code to use a factory or keep the class-like usage.
// The existing code does `new User({...})`. Mongoose models are classes.
// To support `new User(...)` pattern with a fallback, we need a Proxy or a class.

class InMemoryUserClass {
    constructor(data: any) {
        return UserStore.createModel(data);
    }
}

export const User = new Proxy(MongoUser, {
    construct(target, args) {
        if (mongoose.connection.readyState === 1) {
            return new (target as any)(...args);
        }
        return new (InMemoryUserClass as any)(...args);
    },
    get(target, prop) {
        if (mongoose.connection.readyState === 1) {
            return (target as any)[prop];
        }
        // Redirect static methods to UserStore
        if (prop === 'findOne') return (query: any) => UserStore.findOne(query);
        if (prop === 'findById') return (id: any) => UserStore.findOne({ _id: id });
        return (target as any)[prop];
    }
});
