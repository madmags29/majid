import express from 'express';
import BlogPost from '../models/BlogPost';
import BlogKeyword from '../models/BlogKeyword';
import { generateBlogContent, fetchPexelsImages, generateBlogSlug } from '../services/blogService';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Public: Get all published posts
router.get('/blog', async (req, res) => {
    try {
        const posts = await BlogPost.find({ isPublished: true }).sort({ publishedDate: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Public: Get single post by slug
router.get('/blog/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Admin: Get all posts (including unpublished)
router.get('/admin/blog', adminAuth, async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Admin: Create/Manual Generate Post
router.post('/admin/blog/generate', adminAuth, async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

    try {
        const content = await generateBlogContent(keyword);
        const images = await fetchPexelsImages(keyword, 6);

        const newPost = new BlogPost({
            title: content.title,
            slug: generateBlogSlug(content.title),
            metaTitle: content.metaTitle,
            metaDescription: content.metaDescription,
            content: JSON.stringify(content),
            heroImage: images[0],
            images: images.slice(1),
            keyword: keyword,
            faqs: content.faqs,
            readingTime: content.readingTime
        });

        await newPost.save();
        
        // Mark keyword as used if it exists in our list
        await BlogKeyword.findOneAndUpdate({ keyword }, { used: true });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Manual generation failed:', error);
        res.status(500).json({ error: 'Failed to generate blog post' });
    }
});

// Admin: Edit Post
router.put('/admin/blog/:id', adminAuth, async (req, res) => {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Admin: Delete Post
router.delete('/admin/blog/:id', adminAuth, async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Admin: Keyword Management
router.get('/admin/blog/keywords', adminAuth, async (req, res) => {
    try {
        const keywords = await BlogKeyword.find().sort({ createdAt: -1 });
        res.json(keywords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch keywords' });
    }
});

router.post('/admin/blog/keywords', adminAuth, async (req, res) => {
    const { keyword } = req.body;
    try {
        const newKeyword = new BlogKeyword({ keyword });
        await newKeyword.save();
        res.status(201).json(newKeyword);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add keyword' });
    }
});

export default router;
