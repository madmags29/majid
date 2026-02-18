import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    comment: string;
    website?: string;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    comment: { type: String, required: true },
    website: { type: String }, // Honeypot field
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IContact>('Contact', ContactSchema);
