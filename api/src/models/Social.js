import mongoose from 'mongoose';

export const Social = mongoose.model("Social", {
    name: String,
    url: String
});