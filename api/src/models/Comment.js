import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const commentSchema = new Schema({
    trackId: string,
    comment: string,
    artistId: string,
    replyToArtistId: string
})

export const Comment = mongoose.model("Comment", commentSchema);