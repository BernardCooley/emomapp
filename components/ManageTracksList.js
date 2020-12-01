import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Button, Text, IconButton, useTheme, Divider, Avatar } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';

import { ARTIST_TRACKS } from '../queries/graphQlQueries';
import { dateFormat } from '../functions/dateFormat';
import { getImageUrl } from '../functions/getImageUrl';

const ManageTracksList = ({ artistId, trigRefetch }) => {
    const [state, setState] = useState('');

    const { loading, error, data, refetch } = useQuery(ARTIST_TRACKS, {
        variables: {
            id: artistId
        }
    });

    useEffect(() => {
        console.log('Refetch');
        refetch();
    }, [trigRefetch]);

    const editTrack = trackId => {
        console.log(trackId);
    }

    const playTrack = trackId => {
        console.log(trackId);
    }

    const deleteTrack = trackId => {
        console.log(trackId);
    }

    return (
        <View style={styles.container}>
            {data && data.artists[0].userTracks.map((track, index) => (
                <View style={styles.track} key={index}>
                    <View style={styles.trackDetailsContainer}>
                        <View style={styles.trackDetails}>
                            <Text><Text style={styles.trackDetailTitle}>Title: </Text>{track.title}</Text>
                            <Text><Text style={styles.trackDetailTitle}>Album: </Text>{track.album}</Text>
                            <Text><Text style={styles.trackDetailTitle}>Genre: </Text>{track.genre}</Text>
                            <Text><Text style={styles.trackDetailTitle}>Description: </Text>{track.description}</Text>
                            <Text><Text style={styles.trackDetailTitle}>Duration: </Text>{track.duration}</Text>
                            <Text><Text style={styles.trackDetailTitle}>Uploaded: </Text>{dateFormat(track.createdAt)}</Text>
                        </View>
                        <View style={styles.trackImage}>
                            {track.imageName.length > 0 &&
                                <Avatar.Image style={styles.artistImage} size={110} source={{ uri: getImageUrl(data.artists[0].id, track.imageName, track.id) }} />
                            }
                        </View>
                    </View>
                    <View style={styles.trackButtons}>
                            <Button onPress={() => editTrack(track.id)}>Edit</Button>
                            <Button onPress={() => playTrack(track.id)}>Play</Button>
                            <Button onPress={() => deleteTrack(track.id)}>Delete</Button>
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
    trackDetailTitle: {
        fontWeight: 'bold'
    },
    container: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 30
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
        width: '60%'
    },
    trackImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%'
    },
    trackButtons: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row'
    }
});

export default ManageTracksList;