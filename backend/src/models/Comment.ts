import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    userName: string;
    content: string;
    createdAt: Date;
    isApproved: boolean;
}

const CommentSchema: Schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Index for fetching comments for a post
CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
