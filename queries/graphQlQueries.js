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