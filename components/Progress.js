import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useTrackPlayerProgress } from 'react-native-track-player/lib/hooks';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';

const Progress = ({ }) => {
    const { colors } = useTheme();
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();
    const playerContext = usePlayerContext();

    return (
        <View style={styles.progressBarContainer}>
            <AnimatedCircularProgress
                rotation={0}
                tintTransparency
                size={350}
                renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill={colors.secondary} />}
                width={5}
                lineCap='round'
                fill={Math.round(position) / playerContext.currentTrack.duration * 100}
                tintColor={colors.secondary} />
        </View>
    )
}

const styles = StyleSheet.create({
    progressBarContainer: {

    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        top: -30
    }
});

export default Progress;