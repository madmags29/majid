import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wtrip';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = {
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedPassword,
            isAdmin: true,
            status: 'active'
        };

        const existing = await User.findOne({ email: adminUser.email });
        if (existing) {
            await User.deleteOne({ email: adminUser.email });
        }

        await User.create(adminUser);
        console.log('Admin user created successfully: admin@test.com / admin123');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
