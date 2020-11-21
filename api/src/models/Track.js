import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const trackSchema = new Schema({
    title: string,
    album: string,
    artistId: string,
    description: string,
    genre: string,
    title: string,
    duration: string,
    imageName: string
}, { timestamps: true });

export const Track = mongoose.model("Track", trackSchema);