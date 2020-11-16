import mongoose from 'mongoose';

export const Comment = mongoose.model("Comment", {
    comment: String,
    artistId: String
});