import mongoose from 'mongoose';
import { string, array } from './schemaTypes';

const { Schema } = mongoose;

const artistSchema = new Schema({
    artistName: string,
    bio: string,
    location: string,
    website: string, 
    socials: array
})

export const Artist = mongoose.model("Artist", artistSchema);