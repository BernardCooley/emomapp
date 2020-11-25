import { Track } from './models/Track';
import { Artist } from './models/Artist';
import { Comment } from './models/Comment';
import mongoose from 'mongoose';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import path from 'path';

const gc = new Storage({
    keyFilename: path.join(__dirname, '../../keys/emom-84ee4-5357112afa88.json'),
    projectId: 'emom-84ee4'
});

const filesBucket = gc.bucket('emom-files');

export const resolvers = {
    Query: {
        tracks: async (_, { _id, _artistId, _genre, _album }) => {
            if (_id) {
                return [await Track.findById(_id)];
            };
            if (_artistId) {
                return await Track.find({ artistId: _artistId });
            };
            if (_genre) {
                return await Track.find({ genre: _genre });
            };
            if (_album) {
                return await Track.find({ album: _album });
            };

            return await Track.find();
        },
        artists: async (_, { _artistIds, _id, _location }) => {
            if (_artistIds) {
                return await Artist.find().where('_id').in(_artistIds);
            }
            if (_id) {
                return [await Artist.findById(_id)];
            };
            if (_location) {
                return await Artist.find({ location: _location });
            };

            return await Artist.find();
        },
        comments: async (_, { _trackId }) => {
            if(_trackId) {
                // TODO not sorting correctly
                return await Comment.find().where('trackId').equals(_trackId).sort({ createdAt: 1 })
            }

            return [];
        },
    },
    Artist: {
        userTracks: async (_parent) => {
            return await Track.find().where('artistId').equals(_parent.id);
        }
    },
    Track: {
        artist: async (_parent) => {
            return await Artist.findById(_parent.artistId);
        }
    },
    Comment: {
        artist: async (_parent) => {
            return await Artist.findById(_parent.artistId);
        }
    },
    Mutation: {
        addTrack: async (_, { album, artistId, description, genre, title, duration }) => {
            const track = new Track({ album, artistId, description, genre, title, duration });
            await track.save();
            return track;
        },
        addArtist: async (_, { artistName, bio, location, website, artistImageName, facebook, soundcloud, mixcloud, spotify, instagram, twitter, bandcamp, otherSocial }) => {
            const artist = new Artist({ artistName, bio, location, website, artistImageName, facebook, soundcloud, mixcloud, spotify, instagram, twitter, bandcamp, otherSocial });
            await artist.save();
            return artist;
        },
        addComment: async (_, { trackId, comment, artistId, replyToArtistId }) => {
            const newComment = new Comment({ trackId, comment, artistId, replyToArtistId });
            await newComment.save();
            return newComment
        },
        uploadImage: async (_, { file }) => {
            const { createReadStream, filename } = await file;

            await new Promise(res => 
                createReadStream()
                    .pipe(
                        filesBucket.file(filename).createWriteStream({
                            resumable: false,
                            gzip: true
                        })
                    )
                    .on('finish', res)   
            )

            return true
        }
    }
}







