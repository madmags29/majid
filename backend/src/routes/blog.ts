import express from 'express';
import BlogPost from '../models/BlogPost';
import BlogKeyword from '../models/BlogKeyword';
import Comment from '../models/Comment';
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

// Public: Get comments for a post
router.get('/blog/:slug/comments', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const comments = await Comment.find({ postId: post._id, isApproved: true }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Public: Post a comment
router.post('/blog/:slug/comments', async (req, res) => {
    const { userName, content } = req.body;
    if (!userName || !content) return res.status(400).json({ error: 'Name and content are required' });

    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const newComment = new Comment({
            postId: post._id,
            userName,
            content,
            isApproved: false // Require moderation
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment submitted for moderation', comment: newComment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment' });
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

// Admin: Manual Create Post
router.post('/admin/blog', adminAuth, async (req, res) => {
    try {
        const newPost = new BlogPost({
            ...req.body,
            slug: req.body.slug || generateBlogSlug(req.body.title)
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Admin: Get all comments for moderation
router.get('/admin/comments', adminAuth, async (req, res) => {
    try {
        const comments = await Comment.find().populate('postId', 'title').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Admin: Moderate Comment (Approve/Reject)
router.patch('/admin/comments/:id', adminAuth, async (req, res) => {
    const { isApproved } = req.body;
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to moderate comment' });
    }
});

// Admin: Delete Comment
router.delete('/admin/comments/:id', adminAuth, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
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
