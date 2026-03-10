import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String, // HTML content
    required: true
  },
  heroImage: {
    type: String, // URL from Pexels
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  keyword: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Team Weekend Travellers'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexing for search and performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ publishedDate: -1 });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
