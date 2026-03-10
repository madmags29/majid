import mongoose from 'mongoose';

const blogKeywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  usedAt: {
    type: Date
  }
});

// Index to easily find unused keywords
blogKeywordSchema.index({ used: 1, createdAt: 1 });

export const BlogKeyword = mongoose.model('BlogKeyword', blogKeywordSchema);
