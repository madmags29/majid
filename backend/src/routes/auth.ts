import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

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
        console.log('Login attempt for:', email);

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found in DB:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', user.email, 'ID:', user._id);

        // Validate password
        // If user was created via social login, they might not have a password
        if (!user.password) {
            return res.status(400).json({ message: 'Please login with your social account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
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

    } catch (error: any) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'postmessage'
);

// GOOGLE CALLBACK (Redirect flow)
router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send('Authentication code is missing');
        }

        // Determine the redirect URI used for this request
        // It must exactly match what was sent to Google originally
        let redirectUri = process.env.GOOGLE_REDIRECT_URI;

        if (!redirectUri || redirectUri === 'postmessage') {
            const protocol = req.protocol;
            const host = req.get('host');
            redirectUri = `${protocol}://${host}${req.baseUrl}${req.path}`;
        }

        console.log('Google Callback Redirect URI:', redirectUri);

        // Exchange code for tokens
        const { tokens } = await client.getToken({
            code: code as string,
            redirect_uri: redirectUri
        });

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).send('Invalid Google Token');
        }

        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return res.status(400).send('Email not provided by Google');
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                picture,
                googleId
            });
            await user.save();
        } else {
            let updated = false;
            if (!(user as any).googleId) {
                (user as any).googleId = googleId;
                updated = true;
            }
            if (picture && user.picture !== picture) {
                user.picture = picture;
                updated = true;
            }
            if (updated) await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // Build frontend redirect URL
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const userJson = JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture
        });

        const finalRedirectUrl = `${clientUrl}?token=${jwtToken}&user=${encodeURIComponent(userJson)}`;
        res.redirect(finalRedirectUrl);

    } catch (error: any) {
        console.error('Google Callback Error:', error);
        res.status(500).send('Authentication failed: ' + error.message);
    }
});

router.post('/google', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Code is required' });
        }

        // Exchange code for tokens
        const { tokens } = await client.getToken({
            code,
            redirect_uri: req.body.redirect_uri || process.env.GOOGLE_REDIRECT_URI || 'postmessage'
        });

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: 'Invalid Google Token' });
        }

        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return res.status(400).json({ message: 'Email not provided by Google' });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                picture,
                googleId
            });
            await user.save();
        } else {
            // Update provider ID and picture if missing/changed
            let updated = false;
            if (!(user as any).googleId) {
                (user as any).googleId = googleId;
                updated = true;
            }
            if (picture && user.picture !== picture) {
                user.picture = picture;
                updated = true;
            }
            if (updated) await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        // Send Email (Mocked or Real)
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        // Use a test account or configured transport
        // For development, we'll log the link if no SMTP configured
        if (!process.env.SMTP_HOST) {
            console.log('--- PASSWORD RESET LINK ---');
            console.log(resetUrl);
            console.log('---------------------------');
            return res.json({ message: 'Email sent (check console for link in dev mode)' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        res.json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been updated' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// GET CURRENT USER (ME)
router.get('/me', authenticateToken, async (req: any, res: any) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE PROFILE
router.put('/profile', authenticateToken, async (req: any, res: any) => {
    try {
        const { name, picture } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (picture) user.picture = picture;

        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CHANGE PASSWORD
router.put('/password', authenticateToken, async (req: any, res: any) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // If user has no password (social login), we might allow setting one without current, 
        // but typically they should use Forgot Password flow or we just check if it exists.
        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
