import express from 'express';
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Mock email sending function
const sendEmail = async (data: any) => {
    console.log('--- Contact Form Submission ---');
    console.log(`To: trip@weekendtravellers.com`);
    console.log(`From: ${data.name} <${data.email}>`);
    console.log(`Phone: ${data.phone}`);
    console.log(`Message: ${data.comment}`);
    console.log('-------------------------------');
    return true;
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
