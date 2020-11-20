import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    input Social {
        name: String!,
        url: String!
    }

    type Track {
        album: String,
        artistId: String!,
        description: String,
        genre: String,
        id: ID!,
        title: String!,
        duration: Int!
        imageName: String
    }

    type Artist {
        artistName: String!,
        bio: String,
        location: String,
        website: String,
        id: ID,
        artistImageName: String
    }
    
    type Comment {
        id: ID!,
        trackId: String!
        comment: String!,
        artistId: String!,
        replyToArtistId: String,
        artist: Artist!
    }

    type Query {
        tracks(
            _id: String,
            _artistId: String,
            _genre: String,
            _album: String
        ): [Track!]!
        artists(
            _artistIds: [ID],
            _id: String,
            _location: String
        ): [Artist!]!
        comments(
            _trackId: String!
        ): [Comment]
        artist(
            _artistId: String
        ): Artist
    }
    type Mutation {
        addTrack(
            album: String,
            artistId: String!,
            description: String,
            genre: String,
            title: String!,
            duration: Int!
        ): Track!
        addArtist(
            artistName: String!,
            bio: String,
            location: String,
            website: String
        ): Artist!
        addComment(
            trackId: String!
            comment: String!,
            artistId: String!
        ): Track!
    }
`;