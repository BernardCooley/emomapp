import mongoose from 'mongoose';

export const Track = mongoose.model("Track", {
    title: String,
    album: String,
    artistId: String,
    description: String,
    genre: String,
    title: String,
    duration: Number
});