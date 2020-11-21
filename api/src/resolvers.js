import { Track } from './models/Track';
import { Artist } from './models/Artist';
import { Comment } from './models/Comment';
import mongoose from 'mongoose';

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
        addArtist: async (_, { artistName, bio, location, website }) => {
            const artist = new Artist({ artistName, bio, location, website });
            await artist.save();
            return artist;
        },
        addComment: async (_, { trackId, comment, artistId, replyToArtistId }) => {
            const newComment = new Comment({ trackId, comment, artistId, replyToArtistId });
            await newComment.save();
            return newComment
        }
    }
}







