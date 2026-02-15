import express from 'express';
const { body, validationResult } = require('express-validator');

const router = express.Router();

import nodemailer from 'nodemailer';

// Email Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (data: any) => {
    console.log('--- Sending Email ---');
    try {
        await transporter.sendMail({
            from: `"${data.name}" <${process.env.SMTP_USER}>`, // Sender address must be verified/authenticated
            to: process.env.CONTACT_EMAIL || 'trip@weekendtravellers.com', // List of receivers
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
        throw error;
    }
};

router.post(
    '/contact',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('comment').trim().notEmpty().withMessage('Comment is required'),
        // Simple honeypot check: 'website' field should be empty
        body('website').custom((value: string) => {
            if (value) {
                throw new Error('Spam detected');
            }
            return true;
        }),
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, comment } = req.body;

        try {
            await sendEmail({ name, email, phone, comment });
            res.json({ success: true, message: 'Thank you for your message. We will get back to you soon!' });
        } catch (error) {
            console.error('Contact form submission error:', error);
            res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
    }
);

export default router;
