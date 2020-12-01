import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Title, IconButton, Modal, Portal, Text, useTheme, ActivityIndicator } from 'react-native-paper';

import { setTrackUploadModalOpen } from '../Actions/index';
import modalStyles from '../styles/ModalStyles';
import ManageTracksList from '../components/ManageTracksList';
import TrackUploadForm from '../components/TrackUploadForm';
import { useAccountContext } from '../contexts/AccountContext';


const TrackUploadModal = ({ trackAmount, artistId }) => {
    const accountContext = useAccountContext();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const trackUploadModalOpen = useSelector(state => state.trackUploadModalOpen);
    const [formOpen, setFormOpen] = useState(false);
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const closeModal = () => {
        dispatch(setTrackUploadModalOpen(false));
    }


    return (
        <Portal>
            <Modal visible={trackUploadModalOpen} onDismiss={closeModal} contentContainerStyle={styles.modalContainerStyles}>
                <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={closeModal} />
                <Title style={styles.modalTitle}>Manage tracks</Title>
                {!accountContext.isUploading ?
                    <View style={styles.modalContentContainer}>
                        {formOpen ?
                            <TrackUploadForm artistId={artistId} /> :
                            <>
                                <ManageTracksList artistId={artistId} trigRefetch={triggerRefetch} />
                                <View style={styles.addButonContainer}>
                                    {trackAmount < 3 &&
                                        <IconButton style={styles.addButton} onPress={() => setFormOpen(true)} animated icon="plus" size={50} />
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
    ...modalStyles,
    modalContentContainer: {
        display: 'flex',
        height: '90%',
        margin: 'auto'
    },
    activityIndicatorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 250
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
    uploadingLabel: {
        marginTop: 30
    }
});

export default TrackUploadModal;