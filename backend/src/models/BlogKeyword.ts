import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogKeyword extends Document {
    keyword: string;
    used: boolean;
}

const BlogKeywordSchema: Schema = new Schema({
    keyword: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IBlogKeyword>('BlogKeyword', BlogKeywordSchema);
