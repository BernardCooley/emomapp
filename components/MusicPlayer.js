import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Title, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTrackPlayerProgress } from 'react-native-track-player/lib/hooks';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { commentsModalVisible, queueModalVisible} from '../Actions/index';
import Progress from './Progress';
import QueueModal from '../components/QueueModal';
import CommentsModal from '../components/CommentsModal';
import Grid from '../components/Grid';
import { usePlayerContext } from '../contexts/PlayerContext';

const MusicPlayer = ({ navigation }) => {
    const playerImageSize = useSelector(state => state.playerImageSize);
    const { colors } = useTheme();
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();
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
        }
    }, [playerContext.trackQueue, playerContext.currentTrack]);

    useEffect(() => {
        if (playerContext.currentTrack && Math.round(position) / playerContext.currentTrack.duration * 100 > 5) {
            // TODO set track to listened
        }
    }, [playerContext.currentTrack, position]);

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

    const convertToMins = seconds => {
        let mins = Math.floor(seconds / 60);
        let secs = seconds - (mins * 60);
        return `${mins}:${("0" + secs).slice(-2)}`
    }

    const viewArtistProfile = id => {
        navigation.push('Profile', {
            artistId: id
        });
    }

    const trackFavourited = trackId => {
        return true
    }

    const toggleFavourited = id => {
        console.log(id);
    }

    if (playerContext.isEmpty || !playerContext.currentTrack) {
        return null;
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <LinearGradient colors={[colors.playerLight, colors.playerDark]} style={styles.playerContainer}>
                    <IconButton style={styles.closeIcon} onPress={() => navigation.goBack()} color={colors.lightIconsAndText} animated icon="chevron-down" size={30} />
                    <View style={{ ...styles.sectionContainer, ...styles.trackInfoContainer }}>
                        <Title style={{ color: colors.lightIconsAndText }}>{playerContext.currentTrack.title}</Title>
                        <TouchableOpacity onPress={() => viewArtistProfile(playerContext.currentTrack.artistId)}>
                            <Text style={{ color: colors.lightIconsAndText }}>{playerContext.currentTrack.artist}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...styles.imageAndProgressContainer, ...styles.sectionContainer, height: playerImageSize, width: playerImageSize }}>
                        <View style={{ ...styles.trackImageContainer }}>
                            <Avatar.Image source={{ uri: playerContext.currentTrack.trackImage }} size={playerImageSize} style={styles.image}></Avatar.Image>
                        </View>
                        <View style={{ ...styles.circularProgressContainer, width: playerImageSize, height: playerImageSize }}>
                            <Progress />
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={{ ...styles.timeText, backgroundColor: colors.lightgray70Tr, borderColor: colors.dark, color: colors.dark }}>{
                                playerContext.isPlaying || playerContext.isPaused ?
                                    convertToMins(parseInt(Math.round(position))) : 'Loading'}</Text>
                        </View>
                        <View style={{ ...styles.grid, height: playerImageSize, width: playerImageSize }}>
                            <Grid />
                        </View>
                    </View>
                    <View style={{ ...styles.trackControlsContainer, ...styles.sectionContainer }}>
                        <IconButton color={colors.lightIconsAndText} animated icon="skip-previous" disabled={previousDisabled} size={50} onPress={previousTrack} />
                        <IconButton color={colors.lightIconsAndText} animated icon={playerContext.isPlaying ? "pause" : "play-circle-outline"} size={80} onPress={playPause} />
                        <IconButton color={colors.lightIconsAndText} animated icon="skip-next" disabled={nextDisabled} size={50} onPress={nextTrack} />
                    </View>
                    <View style={{ ...styles.otherControlsContainer, ...styles.sectionContainer }}>
                        <IconButton color={colors.lightIconsAndText} animated icon="comment" size={20} onPress={() => dispatch(commentsModalVisible(true))} />
                        <IconButton color={colors.lightIconsAndText} disabled={filteredQueue.length === 0} animated icon="playlist-play" size={20} onPress={() => dispatch(queueModalVisible(true))} />
                        <IconButton color={colors.lightIconsAndText} animated icon={trackFavourited(playerContext.currentTrack.id) ? 'heart' : 'heart-outline'} size={20} onPress={() => toggleFavourited(playerContext.currentTrack.id)} />
                    </View>
                </LinearGradient>
            </ScrollView>
            <QueueModal tracks={filteredQueue} navigation={navigation} />
            <CommentsModal trackId={playerContext.currentTrack.id} />
        </>
    )
}

MusicPlayer.propTypes = {
    tracks: PropTypes.object,
    navigation: PropTypes.object,
    trackId: PropTypes.string
}

const styles = StyleSheet.create({
    closeIcon: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    scrollView: {
        flex: 1
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
        justifyContent: 'space-between'
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
    trackInfoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackImageContainer: {

    },
    grid: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 20,
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingHorizontal: 30
    }
});

export default MusicPlayer;