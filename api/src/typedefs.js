import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type DownloadURL {
      url: String
    }

    type Comment {
        artist: String!,
        comment: String!,
        artistId: String!
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
        duration: Int!
    }
    type Artist {
        artistName: String!,
        bio: String,
        location: String,
        website: String
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