import { gql } from '@apollo/client';

export const ALL_TRACKS_ALL_DETAILS = gql`
    query Tracks {
        tracks {
            album
            artistId
            description
            genre
            id
            title
            duration
        }
    }
`

export const ALL_ARTISTS_ALL_DETAILS = gql`
    query Artists {
        artists {
            artistName
            bio
            location
            website
            id
            artistImageName
            userTracks {
                id
            }
        }
    }
`

export const ALL_TRACKS_TRACKLIST = gql`
    query Tracks {
        tracks {
            artistId
            title
            id
            imageName
            duration
            artist {
                artistName
            }
        }
    }
`

export const TRACK_COMMENTS = gql`
    query Comments($trackId: String!) {
        comments(_trackId: $trackId) {
            artistId
            trackId
            comment
            replyToArtistId
            createdAt
            artist {
                artistName
            }
        }
    }
`





export const ADD_NEW_TRACK = gql`
        mutation addTrack(
            $album: String, 
            $artistId: String!, 
            $description: String, 
            $genre: String,
            $title: String!, 
            $duration: Int!
        ) {
            addTrack(
                album : $album,
                artistId : $artistId,
                description : $description,
                genre : $genre,
                title : $title,
                duration : $duration,
            ) {
                album
            }
        }
    `;

export const ADD_COMMENT = gql`
    mutation addComment(
        $trackId: String!,
        $comment: String!,
        $artistId: String!,
        $replyToArtistId: String
    ) {
        addComment(
            trackId: $trackId,
            comment: $comment,
            artistId: $artistId,
            replyToArtistId: $replyToArtistId
        ) {
            id
        }
    }
`;

export const ADD_ARTIST = gql`
    mutation addArtist(
        $artistName: String!,
        $bio: String,
        $location: String,
        $website: String,
        $artistImageName: String,
        $facebook: String,
        $soundcloud: String,
        $mixcloud: String,
        $spotify: String,
        $instagram: String,
        $twitter: String,
        $bandcamp: String,
        $otherSocial: String
    ) {
        addArtist(
            artistName: $artistName,
            bio: $bio,
            location: $location,
            website: $website,
            artistImageName: $artistImageName,
            facebook: $facebook,
            soundcloud: $soundcloud,
            mixcloud: $mixcloud,
            spotify: $spotify,
            instagram: $instagram,
            twitter: $twitter,
            bandcamp: $bandcamp,
            otherSocial: $otherSocial
        ) {
            id
        }
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation uploadImage(
        $file: Upload!
    ) {
        uploadImage(
            file: $file
        )
    }
`;