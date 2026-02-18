import express from 'express';
const { body, validationResult } = require('express-validator');
import Contact from '../models/Contact';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (data: any) => {
    console.log('--- Sending Notification Email ---');
    try {
        await transporter.sendMail({
            from: `"Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || 'trip@weekendtravellers.com',
            replyTo: data.email,
            subject: `New Contact Message from ${data.name}`,
            text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Message: ${data.comment}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>Message:</strong></p>
<p>${data.comment.replace(/\n/g, '<br>')}</p>
            `,
        });
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Nodemailer error:', error);
        // We don't throw here so the DB save still succeeds in the response
        return false;
    }
};

router.post(
    '/contact',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('comment').trim().notEmpty().withMessage('Comment is required'),
        // Honeypot check
        body('website').custom((value: string) => {
            if (value) throw new Error('Spam detected');
            return true;
        }),
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, comment, website } = req.body;

        try {
            // 1. Save to Database (Critical)
            const newContact = new Contact({ name, email, phone, comment, website });
            await newContact.save();
            console.log('Contact message saved to DB');

            // 2. Send Email (Non-critical for success response)
            sendEmail({ name, email, phone, comment }).catch(err => {
                console.error('Background Email Error:', err);
            });

            // 3. Log conversion
            const { TrafficSource } = require('../models/Analytics');
            await TrafficSource.create({
                source: 'Direct',
                sessionId: req.headers['x-session-id'] || 'unknown',
                path: '/contact',
                isConversion: true,
                conversionType: 'Contact Lead',
                timestamp: new Date()
            }).catch(() => { });

            res.json({
                success: true,
                message: 'Thank you! Your message has been received and saved.'
            });
        } catch (error) {
            console.error('Contact form submission error:', error);
            res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
    }
);

export default router;
