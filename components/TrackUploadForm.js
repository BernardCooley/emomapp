import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Text, useTheme, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation } from '@apollo/client';

import { useAccountContext } from '../contexts/AccountContext';
import formStyles from '../styles/FormStyles';
import useImagePicker from '../hooks/useImagePicker';
import { ADD_NEW_TRACK, UPLOAD_TRACK, UPDATE_TRACK } from '../queries/graphQlQueries';
import useUploadImage from '../hooks/useUploadImage';
import { getImageUrl } from '../functions/getImageUrl';

const TrackUploadForm = ({ artistId }) => {
    const accountContext = useAccountContext();
    const { colors } = useTheme();
    const [trackTitle, setTrackTitle] = useState('');
    const [trackAlbum, setTrackAlbum] = useState('');
    const [trackGenre, setTrackGenre] = useState('');
    const [trackDescription, setTrackDescription] = useState('');
    const [track, setTrack] = useState({});
    const [formValid, setFormValid] = useState(false);
    const [imageUri, setImageUri] = useState('');

    const [uploadadedTrackImageUrl, uploadTrackImage, uploadTrackImageError] = useUploadImage();
    const [artistImage, lauchFileUploader, removeImage] = useImagePicker();

    const [
        addTrackDetails,
        {
            loading: addTrackDetailsLoading,
            error: addTrackDetailsError,
            data: addtrackDetailsData
        }
    ] = useMutation(ADD_NEW_TRACK);

    const [
        uploadTrack,
        {
            loading: trackUploadLoading,
            error: trackUploadError,
            data: trackUploadData
        }
    ] = useMutation(UPLOAD_TRACK);

    const [
        updateTrack,
        {
            loading: updateTrackLoading,
            error: updateTrackError,
            data: updateTrackData
        }
    ] = useMutation(UPDATE_TRACK);

    useEffect(() => {
        if (Object.keys(accountContext.editTrackDetails).length > 0) {
            setTrackTitle(accountContext.editTrackDetails.title);
            setTrackAlbum(accountContext.editTrackDetails.album);
            setTrackGenre(accountContext.editTrackDetails.genre);
            setTrackDescription(accountContext.editTrackDetails.description);
            setTrackTitle(accountContext.editTrackDetails.title);
        }
    }, []);

    useEffect(() => {
        if (accountContext.isEditing) {
            trackTitle.length > 0 ? setFormValid(true) : setFormValid(false);
        } else {
            Object.keys(track).length > 0 && trackTitle.length > 0 ? setFormValid(true) : setFormValid(false);
        }
    }, [track, trackTitle]);

    useEffect(() => {
        if (trackUploadLoading) {
            accountContext.updateUploading(true);
        } else if (!trackUploadLoading && trackUploadData) {
            accountContext.toggleForm(false);
            accountContext.updateUploading(false);
        }
    }, [trackUploadLoading]);

    useEffect(() => {
        if (accountContext.isEditing) {
            if (artistImage.uri) {
                setImageUri(artistImage.uri);
            } else if (accountContext.editTrackDetails.imageName) {
                setImageUri(getImageUrl(accountContext.editTrackDetails.artistId, accountContext.editTrackDetails.imageName, accountContext.editTrackDetails.id));
            } else {
                setImageUri('');
            }
        }
    }, [accountContext.editTrackDetails, artistImage]);

    const clearForm = () => {
        setTrackTitle('');
        setTrackAlbum('');
        setTrackGenre('');
        setTrackDescription('');
        setTrack({});
        removeImage();
    }

    const deleteImage = () => {
        if (accountContext.isEditing) {
            accountContext.updateEditTrackDetails(
                { ...accountContext.editTrackDetails, imageName: '' }
            );
        } else {
            removeImage();
        }
    }

    const openFilePicker = async () => {
        try {
            const res = await DocumentPicker.pick({ type: [DocumentPicker.types.audio] });

            let split = res.uri.split('.');
            split = split[split.length - 1];

            const file = new ReactNativeFile({
                uri: res.uri,
                name: res.name,
                ext: split,
                type: res.type,
                size: res.size
            });

            setTrack(file);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const createTrack = artistId => {
        if (accountContext.isEditing) {
            updateTrack({
                variables: {
                    // TODO not updating
                    title: trackTitle !== accountContext.editTrackDetails.title ? trackTitle : '',
                    album: trackAlbum !== accountContext.editTrackDetails.album ? trackAlbum : '',
                    genre: trackGenre !== accountContext.editTrackDetails.genre ? trackGenre : '',
                    description: trackDescription !== accountContext.editTrackDetails.description ? trackDescription : '',
                }
            }).then(response => {
                if(response) {
                    alert('updated');
                }
            }).catch(err => {
                // TODO delete track data
                console.log('========> Track details update error', err);
                // TODO log the error
                alert('Something went wrong. Please try again. The error has been logged.');
            })
        } else {
            addTrackDetails({
                variables: {
                    album: trackAlbum,
                    artistId: artistId,
                    description: trackDescription,
                    genre: trackGenre,
                    title: trackTitle,
                    duration: 350,
                    imageExtension: artistImage && artistImage.ext ? artistImage.ext : ''
                }
            }).then(response => {
                uploadTrack({
                    variables: {
                        file: track,
                        artistId: artistId,
                        trackId: response.data.addTrackDetails.id
                    }
                }).then(() => {
                    if (artistImage && artistImage.uri) {
                        uploadTrackImage(artistId, artistImage, true, response.data.addTrackDetails.id);
                        clearForm();
                    }
                }).catch(err => {
                    // TODO delete track data
                    console.log('========> Track upload error', err);
                    // TODO log the error
                    alert('Something went wrong. Please try again. The error has been logged.');
                })
            }).catch(err => {

                if (err.toString().indexOf('TypeError') !== -1) {
                    // TODO delete track data
                }

                console.log('Track details error =====> ', err);
                // TODO log the error
                alert('Something went wrong. Please try again. The error has been logged.');
            });
        }
    }

    const cancelUpload = () => {
        accountContext.toggleForm(false);
        accountContext.toggleEditing(false);
        accountContext.updateEditTrackDetails({});
    }

    return (
        <SafeAreaView>
            <ScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}>
                <View style={styles.container}>
                    {accountContext.isUploading ?
                        <View style={{ ...styles.modalContentContainer, height: Dimensions.get('window').height / 2 }}>
                            <View style={styles.activityIndicatorContainer} >
                                <ActivityIndicator size='large' />
                                <Text style={styles.uploadingLabel}>Uploading track...</Text>
                            </View>
                        </View> :
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                label="Title"
                                value={trackTitle}
                                onChangeText={title => setTrackTitle(title)}
                            />
                            <TextInput
                                style={styles.input}
                                label="Album / EP (optional)"
                                value={trackAlbum}
                                onChangeText={album => setTrackAlbum(album)}
                            />
                            <TextInput
                                style={styles.input}
                                label="Genre (optional)"
                                value={trackGenre}
                                onChangeText={genre => setTrackGenre(genre)}
                            />
                            <TextInput
                                style={styles.input}
                                label="Description (optional)"
                                value={trackDescription}
                                onChangeText={description => setTrackDescription(description)}
                                multiline
                            />

                            {!accountContext.isEditing &&
                                <TouchableOpacity onPress={openFilePicker} style={styles.uploadContainer}>
                                    <MaterialCommunityIcons style={styles.filePickerButton} name="music-box-outline" size={30} />
                                    <View>
                                        {track.name && track.name.length > 0 ?
                                            <Text style={styles.filePickerLabel}>{track.name}</Text> :
                                            <Text style={styles.filePickerLabel}>Choose track</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity onPress={lauchFileUploader} style={styles.uploadContainer}>
                                {imageUri.length > 0 ?
                                    <View style={styles.artistImageContainer}>
                                        <Avatar.Image style={styles.artistImage} size={300} source={{ uri: imageUri }} />
                                        <Text onPress={deleteImage} style={styles.deleteImageButton}>delete</Text>
                                    </View> :
                                    <>
                                        <MaterialCommunityIcons style={styles.filePickerButton} name="file-image-outline" size={30} />
                                        <Text style={styles.filePickerLabel}>Choose image (optional)</Text>
                                    </>
                                }
                            </TouchableOpacity>

                            <View style={styles.buttonContainer}>
                                <Button onPress={cancelUpload} color={colors.primary} style={styles.formButton} mode='outlined'>Cancel</Button>
                                <Button disabled={!formValid} onPress={() => createTrack(artistId)} color={colors.primary} style={styles.formButton} mode={formValid ? 'contained' : 'outlined'}>{accountContext.isEditing ? 'Save' : 'Upload track'}</Button>
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

TrackUploadForm.propTypes = {

};

const styles = StyleSheet.create({
    ...formStyles,
    uploadContainer: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-start',
        marginLeft: 5
    },
    filePickerButton: {
        marginRight: 10
    },
    filePickerLabel: {
        fontSize: 20,
        color: 'gray'
    },
    artistImageContainer: {
        flex: 1,
        alignItems: 'center'
    },
    deleteImageButton: {
        color: 'red',
        marginTop: 10,
        fontSize: 15
    },
    formButton: {
        marginTop: 50
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalContentContainer: {
        display: 'flex',
        margin: 'auto'
    },
    activityIndicatorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
        top: -100
    },
    uploadingLabel: {
        marginTop: 30
    }
});

export default TrackUploadForm;