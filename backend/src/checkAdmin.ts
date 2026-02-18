import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const checkAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        // Mask the URI for logging privacy
        console.log(`URI: ${MONGODB_URI.split('@')[1] || '...hidden...'}`);

        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const adminEmail = process.argv[2] || 'admin@weekendtravellers.com';

        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('---------------------------------------------------');
            console.log(`✅ Admin User Found: ${user.email}`);
            console.log(`   ID: ${user._id}`);
            console.log(`   Role: ${user.isAdmin ? 'Admin' : 'User (Not Admin!)'}`);
            console.log(`   Status: ${user.status}`);
            console.log(`   Password Hash Exists: ${!!user.password}`);
            console.log('---------------------------------------------------');
        } else {
            console.log('---------------------------------------------------');
            console.log(`❌ Admin User NOT FOUND: ${adminEmail}`);
            console.log('---------------------------------------------------');
            console.log('Run "npx ts-node src/seedAdmin.ts" to create it.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking admin:', error);
        process.exit(1);
    }
};

checkAdmin();
