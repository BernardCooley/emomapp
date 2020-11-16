import { Track } from './models/Track';
import { Artist } from './models/Artist';
import { Social } from './models/Social';
import { Comment } from './models/Comment';

export const resolvers = {
    Query: {
        tracks: async (_, { _id, _artistId, _genre, _album }) => {
            if (_id) {
                return await [Track.findById(_id)];
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
        artists: async (_, { _id, _location }) => {
            if (_id) {
                return await [Artist.findById(_id)];
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
        addArtist: async (_, { artistName, bio, location, website }) => {
            const artist = new Artist({ artistName, bio, location, website });
            await artist.save();
            return artist;
        },
        addComment: async (_, { trackId, comment, artistId }) => {
            const commentObject = new Comment({ comment, artistId });
            const filter = {
                _id: '5faeaf019e1f5ea7a099fed6'
            }
            const update = {
                comments: commentObject
            }


            const track = await Track.findByIdAndUpdate(
                '5faeaf019e1f5ea7a099fed6',
                {
                    $set: update
                },
                {
                    returnNewDocument: true
                }, (error, result) => {
                    console.log(result);
                    return result
                });

            // let track = await Track.findOneAndUpdate(filter, update, (error, result) => {
                
            // });

            // track = await Track.findOne(filter);

            // console.log(track);

            return track;



            // const track = await Track.findById(trackId);

            // if (!track.comments) {
            //     track.comments = [];
            // }

            // await track.comments.push(commentObject);

            // await track.save();
            // return track;
        }
    }
}







