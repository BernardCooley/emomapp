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

export const ARTIST_PROFILE = gql`
    query Artists($id: String!) {
        artists(_id: $id) {
            artistName
            bio
            location
            website
            artistImageName
            userTracks {
                artistId
                title
                id
                imageName
                duration
            }
            facebook
            soundcloud
            mixcloud
            spotify
            instagram
            twitter
            bandcamp
            otherSocial
            id
            createdAt
        } 
    }
`

export const ARTIST_TRACKS = gql`
    query Artists($id: String!) {
        artists(_id: $id) {
            userTracks {
                artistId
                title
                id
                imageName
                duration
                createdAt
                imageName
            }
            artistName
            id
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
        mutation addTrackDetails(
            $album: String, 
            $artistId: String!, 
            $description: String, 
            $genre: String,
            $title: String!, 
            $duration: Int!,
            $imageExtension: String
        ) {
            addTrackDetails(
                album : $album,
                artistId : $artistId,
                description : $description,
                genre : $genre,
                title : $title,
                duration : $duration,
                imageExtension: $imageExtension
            ) {
                id
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
        $otherSocial: String,
        $_id: ID
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
            otherSocial: $otherSocial,
            _id: $_id
        ) {
            id
        }
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation uploadImage(
        $file: Upload!,
        $artistId: String!,
        $isTrackImage: Boolean!,
        $trackId: String
    ) {
        uploadImage(
            file: $file,
            artistId: $artistId,
            isTrackImage: $isTrackImage,
            trackId: $trackId
        )
    }
`;

export const UPLOAD_TRACK = gql`
    mutation uploadTrack(
        $file: Upload!,
        $artistId: String!,
        $trackId: String!
    ) {
        uploadTrack(
            file: $file,
            artistId: $artistId,
            trackId: $trackId
        )
    }
`;

export const DELETE_TRACK_DETAILS = gql`
    mutation deleteTrackDetails(
        $trackId: String!
    ) {
        deleteTrackDetails(
            trackId: $trackId
        )
    }
`;

export const DELETE_TRACK_UPLOAD = gql`
    mutation deleteTrackUpload(
        $artistId: String!,
        $trackId: String!
    ) {
        deleteTrackUpload(
            artistId: $artistId
            trackId: $trackId
        )
    }
`;