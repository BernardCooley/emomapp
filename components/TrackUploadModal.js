import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Title, IconButton, Modal, Portal, Provider, Text, Button, useTheme, TextInput } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useMutation } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { setTrackUploadModalOpen } from '../Actions/index';
import modalStyles from '../styles/ModalStyles';
import { ADD_NEW_TRACK, UPLOAD_TRACK } from '../queries/graphQlQueries';
import formStyles from '../styles/FormStyles';


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
    const [formValid, setFormValid] = useState(false);

    const [
        addTrack,
        {
            loading: trackLoading,
            error: trackError,
            data: trackData
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
        setTrackTitle('');
        setTrackAlbum('');
        setTrackGenre('');
        setTrackDescription('');
    }

    const createTrack = artistId => {
        addTrack({
            variables: {
                album: $album,
                artistId: $artistId,
                description: $description,
                genre: $genre,
                title: $title,
                duration: $duration
            }
        });
    }

    const openFilePicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });

            let split = res.uri.split('.');
            split = split[split.length - 1];

            setTrack({
                uri: res.uri,
                name: res.name,
                ext: split,
                type: res.type,
                size: res.size
            })


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const callUploadTrack = () => {
        const file = new ReactNativeFile({
            uri: track.uri,
            name: track.name,
            type: track.type,
            ext: track.ext,
            size: track.size
        });

        uploadTrack({
            variables: {
                file: file,
                artistId: artistId,
                trackId: ''
            }
        });
    }

    // TODO upload image

    return (
        <Portal>
            <Modal visible={trackUploadModalOpen} onDismiss={closeModal} contentContainerStyle={styles.modalContainerStyles}>
                <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={closeModal} />
                <Title style={styles.modalTitle}>Track upload</Title>
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
                                            <MaterialCommunityIcons style={styles.trackPickerButton} name="music-box-outline" size={30} />
                                            <View>
                                                {track.name && track.name.length > 0 ?
                                                    <Text style={styles.trackPickerLabel}>{track.name}</Text> :
                                                    <Text style={styles.trackPickerLabel}>Choose track</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>

                                        <Button disabled={!formValid} onPress={createTrack} color={colors.primary} style={styles.uploadButton} mode='outlined'>Upload track</Button>
                                    </View>
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                    }
                    {!formOpen &&
                        <View>
                            {trackAmount < 3 ?
                                <IconButton onPress={() => setFormOpen(true)} animated icon="plus" size={50} /> :
                                <Text style={styles.limitLabel}>Track limit reached</Text>
                            }
                        </View>
                    }
                </View>
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
    trackPickerLabel: {
        fontSize: 20,
        color: 'gray'
    },
    trackPickerButton: {
        marginRight: 10
    },
    uploadButton: {
        marginTop: 50
    }
});

export default TrackUploadModal;