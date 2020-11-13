import { Track } from './models/Track';
import { Artist } from './models/Artist';

export const resolvers = {
    Query: {
        tracks: async () => {
            return Track.find();
        },
        artists: async () => {
            return Artist.find();
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







