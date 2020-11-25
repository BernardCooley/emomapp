import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const artistSchema = new Schema({
    artistName: string,
    bio: string,
    location: string,
    website: string,
    _id: string,
    artistImageName: string,
    facebook: string,
    soundcloud: string,
    mixcloud: string,
    spotify: string,
    instagram: string,
    twitter: string,
    bandcamp: string,
    otherSocial: string
}, { timestamps: true });

export const Artist = mongoose.model("Artist", artistSchema);