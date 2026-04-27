import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    console.log("URI:", process.env.MONGODB_URI ? "Found" : "Missing");
    await mongoose.connect(process.env.MONGODB_URI!);
    const BlogPost = mongoose.model('BlogPost', new mongoose.Schema({ title: String, heroImage: String }));
    const posts = await BlogPost.find({ title: { $regex: /Jaipur|Shimla|Rishikesh/ } });
    posts.forEach(p => console.log(`${p.title}: ${p.heroImage}`));
    process.exit(0);
}
run();
