import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Divider, Avatar, Dialog, Paragraph, IconButton } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';

import { ARTIST_TRACKS, DELETE_TRACK_DETAILS, DELETE_TRACK_UPLOAD } from '../queries/graphQlQueries';
import { dateFormat } from '../functions/dateFormat';
import { getImageUrl } from '../functions/getImageUrl';
import { useAccountContext } from '../contexts/AccountContext';

const ManageTracksList = ({ artistId, trigRefetch, trackAmount }) => {
    const accountContext = useAccountContext();
    const [showDialog, setShowDialog] = useState(false);
    const [clickedTrackId, setClickedTrackId] = useState('');

    const { loading, error, data, refetch } = useQuery(ARTIST_TRACKS, {
        variables: {
            id: artistId
        }
    });

    const [
        deleteTrackDetails,
        {
            loading: deleteTrackDetailsLoading,
            error: deleteTrackDetailsError,
            data: deletetrackDetailsData
        }
    ] = useMutation(DELETE_TRACK_DETAILS);

    const [
        deleteTrackUpload,
        {
            loading: deleteTrackUploadLoading,
            error: deleteTrackUploadError,
            data: deletetrackUploadData
        }
    ] = useMutation(DELETE_TRACK_UPLOAD);

    useEffect(() => {
        setTimeout(() => {
            refetch();
        }, 500);
    }, [trigRefetch]);

    const editTrack = trackId => {
        accountContext.updateEditTrackDetails(data.artists[0].userTracks.filter(track => track.id === trackId)[0]);
        accountContext.toggleEditing(true);
        accountContext.toggleForm(true);
        console.log(trackId);
    }

    const deleteTrack = () => {
        deleteTrackDetails({
            variables: {
                trackId: clickedTrackId
            }
        }).then(deleteTrackDetailsResponse => {
            if (deleteTrackDetailsResponse) {
                deleteTrackUpload({
                    variables: {
                        artistId: artistId,
                        trackId: clickedTrackId
                    }
                }).then(() => {
                    refetch();
                    setShowDialog(false);
                    setClickedTrackId('');
                }).catch(err => {
                    setShowDialog(false);
                    setClickedTrackId('');
                    console.log('Track upload delete error =====>', err);
                    // TODO log the error
                    alert('Something went wrong. Please try again. The error has been logged.');
                });
            }
        }).catch(err => {
            setShowDialog(false);
            setClickedTrackId('');
            console.log('Track details delete error =====>', err);
            // TODO log the error
            alert('Something went wrong. Please try again. The error has been logged.');
        });
    }

    const confirmDelete = trackId => {
        setClickedTrackId(trackId);
        setShowDialog(true);
    }

    return (
        <View style={styles.container}>
            {data && data.artists[0].userTracks.map((track, index) => (
                <View style={styles.track} key={index}>
                    <View style={styles.trackDetailsContainer}>
                        <View style={styles.trackDetails}>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Title: </Text>
                                {track.title}
                            </Text>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Album: </Text>
                                {track.album}
                            </Text>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Genre: </Text>
                                {track.genre}
                            </Text>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Description: </Text>
                                {track.description}
                            </Text>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Duration: </Text>
                                {track.duration}
                            </Text>
                            <Text>
                                <Text style={styles.trackDetailTitle}>Uploaded: </Text>
                                {dateFormat(track.createdAt)}
                            </Text>
                        </View>
                        <View style={styles.trackImage}>
                            {track.imageName && track.imageName.length > 0 ?
                                <Avatar.Image style={styles.artistImage} size={110} source={{ uri: getImageUrl(data.artists[0].id, track.imageName, track.id) }} /> :
                                null
                            }
                        </View>
                    </View>
                    <View style={styles.trackButtons}>
                        <Button onPress={() => editTrack(track.id)}>Edit</Button>
                        <Button onPress={() => confirmDelete(track.id)}>Delete</Button>
                    </View>
                    <Divider style={styles.divider} />
                </View>
            ))}
            <View style={styles.addButonContainer}>
                {trackAmount < 3 &&
                    <IconButton style={styles.addButton} onPress={() => accountContext.toggleForm(true)} animated icon="plus" size={50} />
                }
            </View>
            <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                <Dialog.Title>Delete track</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Are you sure?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={deleteTrack}>Yes, delete</Button>
                    <Button onPress={() => setShowDialog(false)}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
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
    },
    addButonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    addButton: {
        position: 'absolute',
        right: -30,
        bottom: -40
    },
});

export default ManageTracksList;