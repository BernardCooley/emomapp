import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Title, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useTrackPlayerProgress } from 'react-native-track-player/lib/hooks';

import { commentsModalVisible, queueModalVisible, trackComments } from '../Actions/index';
import Progress from './Progress';
import QueueModal from '../components/QueueModal';
import CommentsModal from '../components/CommentsModal';

const MusicPlayer = ({ navigation }) => {
    const { colors } = useTheme();
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();
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
        } else {
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

    const convertToMins = seconds => {
        let mins = Math.floor(seconds / 60);
        let secs = seconds - (mins * 60);
        return `${mins}:${("0" + secs).slice(-2)}`
    }

    if (playerContext.isEmpty || !playerContext.currentTrack) {
        return null;
    }

    return (
        <>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <LinearGradient colors={['#C5E3E5', '#318E8F', '#3A6E7A']} style={styles.playerContainer}>
                        <View style={{ ...styles.sectionContainer, ...styles.trackInfoContainer }}>
                            <Title>{playerContext.currentTrack.title}</Title>
                            <Text>{playerContext.currentTrack.artist}</Text>
                        </View>
                        <View style={styles.imageAndProgressContainer}>
                            <View style={{ ...styles.trackImageContainer, ...styles.sectionContainer }}>
                                <Avatar.Image source={{ uri: playerContext.currentTrack.trackImage }} size={350} style={styles.image}></Avatar.Image>
                            </View>
                            <View style={{ ...styles.sectionContainer, ...styles.circularProgressContainer }}>
                                <Progress />
                            </View>
                            <View style={styles.timeContainer}>
                                <Text style={{ ...styles.timeText, backgroundColor: colors.lightgray70Tr, borderColor: colors.dark, color: colors.dark}}>{convertToMins(parseInt(Math.round(position)))}</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.trackControlsContainer, ...styles.sectionContainer }}>
                            <IconButton animated icon="shuffle" size={30} onPress={playerContext.shuffle} />
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
        alignItems: 'center',
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
    },
    circularProgressContainer: {
        position: 'absolute',
        top: -5,
        right: 5
    },
    timeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeText: {
        position: 'relative',
        zIndex: 10,
        fontSize: 30,
        textAlign: 'center',
        borderRadius: 50,
        paddingHorizontal: 30,
        borderWidth: 1
    },
    trackInfoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MusicPlayer;