import mongoose from 'mongoose';

export const Artist = mongoose.model("Artist", {
    artistName: String,
    bio: String,
    location: String,
    website: String,
    socials: Array
});