import { Track } from './models/Track';
import { Artist } from './models/Artist';

export const resolvers = {
    Query: {
        // TODO Error happening
        tracks: async (_, {_id, _artistId, _genre, _album }) => {
            if (_id) {
                return await Track.findById(_id);
            };
            if(_artistId) {
                return await Track.find({ artistId: _artistId });
            };
            if(_genre) {
                return await Track.find({ genre: _genre });
            };
            if(_album) {
                return await Track.find({ album: _album });
            };

            return await Track.find();
        },
        artists: async (_, {_id, _location}) => {
            if (_id) {
                return await Artist.findById(_id);
            };
            if (_location) {
                return await Artist.find({ location: _location });
            };
            return await Artist.find();
        }
    },
    Mutation: {
        addTrack: async (_, { album, artistId, description, genre, title, duration }) => {
            const track = new Track({ album, artistId, description, genre, title, duration });
            await track.save();
            return track;
        },
        addArtist: async (_, {artistName, bio, location, website}) => {
            const artist = new Artist({artistName, bio, location, website});
            await artist.save();
            return artist;
        }
    }
}







