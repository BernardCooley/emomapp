import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Button } from 'react-native-paper';

import TracksAndArtists from '../components/TracksAndArtists';

const ADD_NEW_TRACK = gql`
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

const TRACKS_QUERY = gql`
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


const TracksScreen = ({ navigation }) => {
    const [createNewTrack] = useMutation(ADD_NEW_TRACK);
    const { data, loading } = useQuery(TRACKS_QUERY);

    useEffect(() => {
        if(!loading) {
            // console.log(data);
        }
    }, [loading]);

    useEffect(() => {
        console.log(data);
    }, [data]);

    const addTrack = () => {
        createNewTrack({
            variables: {
                album: 'Test album 1',
                artistId: '16bsVlIoreaM8ALWuK6ym7T7V3m2',
                description: 'Test desc 1',
                genre: 'Techno',
                title: 'Test title 1',
                duration: 350,
            }
        }).then(resp => {
            console.log(resp);
        })
    }

    return (
        <>
            <Button onPress={addTrack}>Add track</Button>
        </>
        // <TracksAndArtists artistsOrTracks='tracks' navigation={navigation}/>
    );
}

TracksScreen.propTypes = {
    navigation: PropTypes.object,
    artistsOrTracks: PropTypes.string
}


export default TracksScreen;
