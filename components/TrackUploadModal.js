import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, IconButton, Modal, Portal, Text, ActivityIndicator } from 'react-native-paper';

import { useAccountContext } from '../contexts/AccountContext';
import modalStyles from '../styles/ModalStyles';
import ManageTracksList from '../components/ManageTracksList';
import TrackUploadForm from '../components/TrackUploadForm';


const TrackUploadModal = ({ trackAmount, artistId }) => {
    const accountContext = useAccountContext();

    const closeModal = () => {
        accountContext.toggleManageTracksModal(false);
        accountContext.toggleForm(false);
    }


    return (
        <Portal>
            <Modal visible={accountContext.isManageTracksModalOpen} onDismiss={closeModal} contentContainerStyle={styles.modalContainerStyles}>
                <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={closeModal} />
                <Title style={styles.modalTitle}>Manage tracks</Title>
                <View style={styles.modalContentContainer}>
                    {accountContext.isFormOpen ?
                        <TrackUploadForm artistId={artistId} /> :
                        <ManageTracksList artistId={artistId} trackAmount={trackAmount} />
                    }
                </View>
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
    }
});

export default TrackUploadModal;