import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: string,
    artistId: string
})

export const Comment = mongoose.model("Comment", commentSchema);