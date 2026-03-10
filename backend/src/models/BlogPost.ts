import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    content: string; // HTML or Markdown
    heroImage: string;
    images: string[];
    keyword: string;
    author: string;
    publishedDate: Date;
    isPublished: boolean;
    faqs: { question: string; answer: string }[];
    readingTime: string;
}

const BlogPostSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    content: { type: String, required: true },
    heroImage: { type: String, required: true },
    images: [{ type: String }],
    keyword: { type: String, required: true },
    author: { type: String, default: 'Weekend Travellers' },
    publishedDate: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],
    readingTime: { type: String }
}, {
    timestamps: true
});

// Index for SEO and searching
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ keyword: 1 });
BlogPostSchema.index({ publishedDate: -1 });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
