import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = process.argv[2] || 'admin@weekendtravellers.com';
        const adminPassword = process.argv[3] || 'Admin123!';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin user ${adminEmail} already exists. Updating password/role...`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            existingAdmin.isAdmin = true;
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();

            console.log('---------------------------------------------------');
            console.log('Admin User Updated Successfully');
            console.log(`Email: ${adminEmail}`);
            console.log(`New Password: ${adminPassword}`);
            console.log('---------------------------------------------------');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = new User({
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            isAdmin: true,
            status: 'Active'
        });

        await newAdmin.save();
        console.log('---------------------------------------------------');
        console.log('Admin User Created Successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('---------------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
