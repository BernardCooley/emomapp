import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Button, Text, IconButton, useTheme, Divider, Avatar } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';

import { ARTIST_TRACKS } from '../queries/graphQlQueries';
import { dateFormat } from '../functions/dateFormat';

const ManageTracksList = ({ artistId }) => {
    const [state, setState] = useState('');

    const { loading, error, data, refetch } = useQuery(ARTIST_TRACKS, {
        variables: {
            id: artistId
        }
    });

    useEffect(() => {
        console.log(loading);
        if (data) {
            console.log(data.artists[0].userTracks);
        }
    }, [loading]);

    return (
        <View style={styles.container}>
            {data && data.artists[0].userTracks.map((track, index) => (
                <View style={styles.track} key={index}>
                    <View style={styles.trackDetailsContainer}>
                        <View style={styles.trackDetails}>
                            <Text>Title: {track.title}</Text>
                            <Text>Album: {track.album}</Text>
                            <Text>Genre: {track.genre}</Text>
                            <Text>Description: {track.description}</Text>
                            <Text>Duration: {track.duration}</Text>
                            <Text>Date uploaded: {dateFormat(track.createdAt)}</Text>
                        </View>
                        <View style={styles.trackImage}>
                            <Avatar.Image source={{ uri: playerContext.currentTrack.trackImage }} size={playerImageSize} style={styles.image}></Avatar.Image>
                        </View>
                    </View>
                    <Divider style={styles.divider} />
                </View>
            ))}
        </View>
    )
};

ManageTracksList.propTypes = {

};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    track: {
        width: '100%',
        marginBottom: 10,
    },
    divider: {
        marginTop: 10
    },
    trackDetailsContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    trackDetails: {
        borderWidth: 1,
        width: '60%'
    },
    trackImage: {
        borderWidth: 1,
        width: '40%'
    }
});

export default ManageTracksList;