import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type DownloadURL {
      url: String
    }

    type Reply {
        artist: String!,
        comment: String!,
        artistId: String!
    }

    type Comment {
        artist: String!,
        comment: String!,
        artistId: String!,
        replies: [Reply]
    }

    type Social {
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
        duration: Int!,
        comments: [Comment]
    }
    type Artist {
        artistName: String!,
        bio: String,
        location: String,
        website: String,
        id: ID,
        socials: [Social]
    }
    type Query {
        tracks: [Track!]!
        artists: [Artist!]!
        downloadUrls: DownloadURL
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
    }
`;