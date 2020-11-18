import { gql } from '@apollo/client';

export const ALL_TRACKS_ALL_DETAILS = gql`
    query tracks {
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

export const ALL_TRACKS_TRACKLIST = gql`
    query tracks {
        tracks {
            artistId
            title
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