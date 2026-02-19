const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: String, default: 'Active' }
});

const User = mongoose.model('User', userSchema);

const resetAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@weekendtravellers.com';
        const password = 'Admin123!';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.isAdmin = true;
            await existingAdmin.save();
            console.log(`Updated existing admin: ${email}`);
        } else {
            const newAdmin = new User({
                email,
                password: hashedPassword,
                name: 'Super Admin',
                isAdmin: true
            });
            await newAdmin.save();
            console.log(`Created new admin: ${email}`);
        }

        console.log(`Password set to: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
