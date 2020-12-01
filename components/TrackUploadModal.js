import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Title, IconButton, Modal, Portal, Text, Button, useTheme, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ReactNativeFile } from 'apollo-upload-client';
import { useMutation } from '@apollo/client';

import { setTrackUploadModalOpen } from '../Actions/index';
import modalStyles from '../styles/ModalStyles';
import { ADD_NEW_TRACK, UPLOAD_TRACK } from '../queries/graphQlQueries';
import formStyles from '../styles/FormStyles';
import useUploadImage from '../hooks/useUploadImage';
import useImagePicker from '../hooks/useImagePicker';
import ManageTracksList from '../components/ManageTracksList';


const TrackUploadModal = ({ trackAmount, artistId }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const trackUploadModalOpen = useSelector(state => state.trackUploadModalOpen);
    const [track, setTrack] = useState({});
    const [formOpen, setFormOpen] = useState(false);
    const [trackTitle, setTrackTitle] = useState('');
    const [trackAlbum, setTrackAlbum] = useState('');
    const [trackGenre, setTrackGenre] = useState('');
    const [trackDescription, setTrackDescription] = useState('');
    const [triggerRefetch, setTriggerRefetch] = useState(false);
    const [formValid, setFormValid] = useState(false);
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

    useEffect(() => {
        if (Object.keys(track).length > 0 && trackTitle.length > 0) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [track, trackTitle]);

    const closeModal = () => {
        dispatch(setTrackUploadModalOpen(false));
        clearForm();
    }

    const clearForm = () => {
        setTrackTitle('');
        setTrackAlbum('');
        setTrackGenre('');
        setTrackDescription('');
        setTrack({});
        removeImage();
    }

    const createTrack = artistId => {
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
                    setFormOpen(false);
                    setTriggerRefetch(!triggerRefetch);
                }
            }).catch(err => {
                // TODO delete track data
                console.log('========> Track upload error' ,err);
                alert('Something went wrong. Please try again.');
            })
        }).catch(err => {

            if(err.toString().indexOf('TypeError') !== -1) {
                // TODO delete track data
            }

            console.log('========> Track details error', err);
            alert('Something went wrong. Please try again. The error has been logged.');
        })
    }

    const openFilePicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });

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

    return (
        <Portal>
            <Modal visible={trackUploadModalOpen} onDismiss={closeModal} contentContainerStyle={styles.modalContainerStyles}>
                <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={closeModal} />
                <Title style={styles.modalTitle}>Track upload</Title>
                {!trackUploadLoading ?
                    <View style={styles.modalContentContainer}>
                        {formOpen &&
                            <SafeAreaView>
                                <ScrollView
                                    keyboardShouldPersistTaps='handled'
                                    contentContainerStyle={{
                                        flexGrow: 1,
                                        justifyContent: 'space-between',
                                    }}>
                                    <View style={styles.container}>
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

                                            <TouchableOpacity onPress={openFilePicker} style={styles.uploadContainer}>
                                                <MaterialCommunityIcons style={styles.filePickerButton} name="music-box-outline" size={30} />
                                                <View>
                                                    {track.name && track.name.length > 0 ?
                                                        <Text style={styles.filePickerLabel}>{track.name}</Text> :
                                                        <Text style={styles.filePickerLabel}>Choose track</Text>
                                                    }
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={lauchFileUploader} style={styles.uploadContainer}>
                                                {!artistImage.uri ?
                                                    <>
                                                        <MaterialCommunityIcons style={styles.filePickerButton} name="file-image-outline" size={30} />
                                                        <Text style={styles.filePickerLabel}>Choose image (optional)</Text>
                                                    </> :
                                                    <View style={styles.artistImageContainer}>
                                                        <Avatar.Image style={styles.artistImage} size={300} source={{ uri: artistImage.uri }} />
                                                        <Text onPress={removeImage} style={styles.deleteImageButton}>delete</Text>
                                                    </View>
                                                }
                                            </TouchableOpacity>

                                            <Button disabled={!formValid} onPress={() => createTrack(artistId)} color={colors.primary} style={styles.uploadButton} mode='outlined'>Upload track</Button>
                                        </View>
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        }
                        {!formOpen &&
                            <>
                                <ManageTracksList artistId={artistId} trigRefetch={triggerRefetch} />
                                <View style={styles.addButon}>
                                    {trackAmount < 3 ?
                                        <IconButton onPress={() => setFormOpen(true)} animated icon="plus" size={50} /> :
                                        <Text style={styles.limitLabel}>Track limit reached</Text>
                                    }
                                </View>
                            </>
                        }
                    </View> :
                    <View style={styles.modalContentContainer}>
                        <View style={styles.activityIndicatorContainer} >
                            <ActivityIndicator size='large' />
                            <Text style={styles.uploadingLabel}>Uploading track...</Text>
                        </View>
                    </View>
                }
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    ...formStyles,
    ...modalStyles,
    modalContentContainer: {
        display: 'flex',
        height: '90%',
        margin: 'auto'
    },
    limitLabel: {
        fontSize: 20
    },
    uploadContainer: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-start',
        marginLeft: 5
    },
    filePickerLabel: {
        fontSize: 20,
        color: 'gray'
    },
    filePickerButton: {
        marginRight: 10
    },
    uploadButton: {
        marginTop: 50
    },
    deleteImageButton: {
        color: 'red',
        marginTop: 10,
        fontSize: 15
    },
    artistImageContainer: {
        flex: 1,
        alignItems: 'center'
    },
    activityIndicatorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 250
    },
    uploadingLabel: {
        marginTop: 30
    },
    addButon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
});

export default TrackUploadModal;