import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar, useTheme, Text } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useTrackPlayerProgress } from 'react-native-track-player/lib/hooks';

const Progress = ({ }) => {
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();
    let progressRef = useRef();
    const playerContext = usePlayerContext();
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [progressBarPageX, setProgressBarPageX] = useState(0);

    const convertToMins = seconds => {
        let mins = Math.floor(seconds / 60);
        let secs = seconds - (mins * 60);
        return `${mins}:${("0" + secs).slice(-2)}`
    }

    const skipToTime = e => {
        playerContext.seekTo(playerContext.currentTrack.duration * (e.nativeEvent.pageX - progressBarPageX) / progressBarWidth)
    }

    const getProgressBarDetails = (event) => {
        setProgressBarWidth(event.nativeEvent.layout.width);

        if (progressRef) {
            progressRef.measure((x, y, width, height, pageX, pageY) => {
                setProgressBarPageX(pageX);
            })
        }
    }

    return (
        <View style={styles.progressBarContainer}>
            <View hitSlop={{top: 15, bottom: 15, left: 0, right: 0}} onTouchEnd={(e) => skipToTime(e)} onTouchMove={(e) => skipToTime(e)} ref={(ref) => { progressRef = ref }}
                onLayout={(event) => getProgressBarDetails(event)}>
                <ProgressBar style={styles.progressBar}
                    progress={Math.round(position) / playerContext.currentTrack.duration} color='black' />
            </View>
            <View>
                <ProgressBar style={styles.bufferedBar}
                    progress={Math.round(bufferedPosition) / playerContext.currentTrack.duration} color='black' />
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{convertToMins(parseInt(Math.round(position)))}</Text>
                <Text style={styles.timeText}>{convertToMins(parseInt(playerContext.currentTrack.duration))}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressBarContainer: {

    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16
    },
    progressBar: {
        height: 7,
        borderRadius: 5
    },
    bufferedBar: {
        height: 2
    }
});

export default Progress;