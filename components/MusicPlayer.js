import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Title, Text, Avatar, IconButton } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import { commentsModalVisible, queueModalVisible, trackComments } from '../Actions/index';
import Progress from './Progress';
import QueueModal from '../components/QueueModal';
import CommentsModal from '../components/CommentsModal';

const MusicPlayer = ({ navigation }) => {
    const tracksRef = firestore().collection('tracks');
    const dispatch = useDispatch();
    const [nextDisabled, setNextDisabled] = useState(false);
    const [previousDisabled, setPreviousDisabled] = useState(false);
    const [filteredQueue, setFilteredQueue] = useState([]);
    const playerContext = usePlayerContext();

    useEffect(() => {
        if (playerContext.trackQueue && playerContext.currentTrack) {
            const queue = [...playerContext.trackQueue];
            const track = queue.filter(track => track.id === playerContext.currentTrack.id)[0];
            const currentIdex = (queue).indexOf(track);

            setNextDisabled(currentIdex === queue.length - 1);
            setPreviousDisabled(currentIdex === 0);

            queue.splice(0, currentIdex + 1);
            setFilteredQueue(queue);
            dispatch(queueModalVisible(false));
            dispatch(commentsModalVisible(false));

            const unsibscribe = tracksRef.doc(playerContext.currentTrack.id).onSnapshot(onCommentsGetResult, onCommentsGetError);

            return () => unsibscribe();
        }
    }, [playerContext.trackQueue, playerContext.currentTrack]);

    const onCommentsGetResult = QuerySnapshot => {
        if (QuerySnapshot.data().comments) {
            const comments = QuerySnapshot.data().comments;
            dispatch(trackComments(comments.sort((a, b) => (a.date > b.date) ? 1 : -1)));
        }else {
            dispatch(trackComments([]));
        }
    }

    const onCommentsGetError = error => {
        console.error(error);
    }

    const playPause = () => {
        if (playerContext.isPlaying) {
            playerContext.pause()
        } else {
            playerContext.play()
        }
    }

    const previousTrack = () => {
        playerContext.previous();
    }

    const nextTrack = () => {
        playerContext.next();
    }

    const shuffle = () => {

    }

    const repeat = () => {

    }


    if (playerContext.isEmpty || !playerContext.currentTrack) {
        return null;
    }

    return (
        <>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <LinearGradient colors={['#3A6E7A', '#318E8F', '#C5E3E5']} style={styles.playerContainer}>
                        <View style={{ ...styles.trackImageContainer, ...styles.sectionContainer }}>
                            <Avatar.Image source={{ uri: playerContext.currentTrack.trackImage }} size={300} style={styles.image}></Avatar.Image>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Title>{playerContext.currentTrack.title}</Title>
                            <Text>{playerContext.currentTrack.artist}</Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Progress />
                        </View>
                        <View style={{ ...styles.trackControlsContainer, ...styles.sectionContainer }}>
                            <IconButton animated icon="shuffle" size={30} onPress={e => openMenu(e, tracks[key])} />
                            <IconButton animated icon="skip-previous" disabled={previousDisabled} size={40} onPress={previousTrack} />
                            <IconButton animated icon={playerContext.isPlaying ? "pause" : "play-circle-outline"} size={60} onPress={playPause} />
                            <IconButton animated icon="skip-next" disabled={nextDisabled} size={40} onPress={nextTrack} />
                            <IconButton animated icon="repeat" size={30} onPress={e => openMenu(e, tracks[key])} />
                        </View>
                        <View style={{ ...styles.otherControlsContainer, ...styles.sectionContainer }}>
                            <IconButton animated icon="comment" size={20} onPress={() => dispatch(commentsModalVisible(true))} />
                            <IconButton disabled={filteredQueue.length === 0} animated icon="playlist-play" size={20} onPress={() => dispatch(queueModalVisible(true))} />
                        </View>
                    </LinearGradient>
                </ScrollView>
            </SafeAreaView>
            <QueueModal tracks={filteredQueue} navigation={navigation} />
            <CommentsModal />
        </>
    )
}

MusicPlayer.propTypes = {
    tracks: PropTypes.object,
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerContainer: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 30,
        height: '100%'
    },
    sectionContainer: {
        display: 'flex',
        width: '100%',
        marginVertical: 10
    },
    trackImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackControlsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    otherControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentIcon: {
        marginRight: 50
    },
    queueIcon: {
        marginLeft: 50
    }
});

export default MusicPlayer;