import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar DateTime

    type File {
        url: String!
    }

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
        imageName: String,
        artist: Artist!,
        createdAt: DateTime,
        updatedAt: DateTime
    }

    type Artist {
        artistName: String!,
        bio: String,
        location: String,
        website: String,
        id: ID,
        artistImageName: String,
        userTracks: [Track],
        createdAt: DateTime,
        updatedAt: DateTime,
        facebook: String,
        soundcloud: String,
        mixcloud: String,
        spotify: String,
        instagram: String,
        twitter: String,
        bandcamp: String,
        otherSocial: String
    }
    
    type Comment {
        id: ID!,
        trackId: String!
        comment: String!,
        artistId: String!,
        replyToArtistId: String,
        artist: Artist,
        createdAt: DateTime,
        updatedAt: DateTime
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
        userTracks(
            _artistId: String
        ): [Track]
    }
    type Mutation {
        uploadImage(
            file: Upload!,
            artistId: String!
        ): String
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
            website: String,
            _id: ID,
            artistImageName: String,
            facebook: String,
            soundcloud: String,
            mixcloud: String,
            spotify: String,
            instagram: String,
            twitter: String,
            bandcamp: String,
            otherSocial: String
        ): Artist!
        addComment(
            trackId: String!
            comment: String!,
            artistId: String!,
            replyToArtistId: String
        ): Track!
    }
`;