import mongoose from 'mongoose';
import { User } from './src/models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        const email = 'admin@weekendtravellers.com';
        const password = 'AdminPassword123!';
        const name = 'Admin User';

        let user = await User.findOne({ email });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            console.log('User already exists, updating to admin...');
            (user as any).isAdmin = true;
            (user as any).password = hashedPassword;
            await user.save();
        } else {
            console.log('Creating new admin user...');
            user = new User({
                email,
                password: hashedPassword,
                name,
                isAdmin: true
            });
            await user.save();
        }

        console.log('Admin user created/updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
