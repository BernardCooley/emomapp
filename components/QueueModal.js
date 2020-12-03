import React from 'react';
import { Title, IconButton, useTheme, Modal, Portal, Provider, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { queueModalVisible } from '../Actions/index';

import { usePlayerContext } from '../contexts/PlayerContext';
import TracksList from '../components/TracksList';
import modalStyles from '../styles/ModalStyles';


const QueueModal = ({ tracks, navigation }) => {
    const dispatch = useDispatch();
    const playerContext = usePlayerContext();
    const { colors } = useTheme();
    const isQueueModalVisible = useSelector(state => state.queueModalVisible);

    return (
        <Provider>
            <Portal>
                <Modal visible={isQueueModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainerStyles}>
                    <View style={{ ...styles.queueContainer, ...styles.sectionContainer }}>
                        <Title style={styles.modalTitle}>Queue</Title>
                        <TracksList tracks={tracks.tracks} navigation={navigation} listLocation='playerQueue' />
                    </View>
                    <Button color={colors.primary} mode='text' onPress={() => playerContext.clearQueue()} style={styles.clearButton}>Clear</Button>
                    <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={() => dispatch(queueModalVisible(false))} />
                </Modal>
            </Portal>
        </Provider>
    )
}

QueueModal.propTypes = {
    tracks: PropTypes.array,
    listLocation: PropTypes.string
}

const styles = StyleSheet.create({
    ...modalStyles, ...{
        clearButton: {
            position: 'absolute',
            bottom: 10,
            right: 10
        },
    }
});

export default QueueModal;