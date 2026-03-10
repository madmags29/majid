import express from 'express';
import { BlogPost } from '../models/BlogPost';
import { BlogKeyword } from '../models/BlogKeyword';
import { processManualBlogGeneration } from '../services/blogService';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// --- Public Routes ---

// Get all blog posts
router.get('/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ publishedDate: -1 }).select('-content');
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post by slug
router.get('/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Routes (require admin check) ---

// Manually trigger blog generation
router.post('/admin/blog/generate', adminAuth, async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

    const post = await processManualBlogGeneration(keyword);
    
    // Mark keyword as used if it exists in our queue
    await BlogKeyword.findOneAndUpdate({ keyword }, { used: true, usedAt: new Date() });

    res.json({ message: 'Blog post generated successfully', post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Keyword Queue Management
router.get('/admin/blog/keywords', adminAuth, async (req, res) => {
  try {
    const keywords = await BlogKeyword.find().sort({ createdAt: -1 });
    res.json(keywords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/blog/keywords', adminAuth, async (req, res) => {
  try {
    const { keyword } = req.body;
    const newKeyword = new BlogKeyword({ keyword });
    await newKeyword.save();
    res.json(newKeyword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Edit/Delete posts
router.put('/admin/blog/posts/:id', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/blog/posts/:id', adminAuth, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
