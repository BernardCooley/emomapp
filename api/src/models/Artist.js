import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const artistSchema = new Schema({
    artistName: string,
    bio: string,
    location: string,
    website: string,
    artistImageName: string
})

export const Artist = mongoose.model("Artist", artistSchema);