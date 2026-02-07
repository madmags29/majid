import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check user existence
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });

        await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        // If user was created via social login, they might not have a password
        if (!user.password) {
            return res.status(400).json({ message: 'Please login with your social account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// SOCIAL LOGIN MOCK (For now)
router.post('/social-login', async (req, res) => {
    try {
        const { email, name, provider, providerId, picture } = req.body;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                picture,
                [`${provider.toLowerCase()}Id`]: providerId // e.g. googleId: '123'
            });
            await user.save();
        } else {
            // Update provider ID if missing
            const providerField = `${provider.toLowerCase()}Id`;
            if (!(user as any)[providerField]) {
                (user as any)[providerField] = providerId;
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Social Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
