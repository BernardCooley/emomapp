import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useTheme } from 'react-native-paper';

import ClickGridCoordinates from '../data/ClickGridCoordinates';

const Grid = () => {
    const { colors } = useTheme();
    const range = 20;
    const playerContext = usePlayerContext();
    const playerImageSize = useSelector(state => state.playerImageSize);

    const clickProgressBar = e => {
        clickedOnBar(Math.round(e.nativeEvent.locationX), Math.round(e.nativeEvent.locationY));
    }

    const clickedOnBar = (clickedX, clickedY) => {
        const validClickCoordinates = ClickGridCoordinates.filter(coord => coord.x > clickedX - range && coord.x < clickedX + range && coord.y > clickedY - range && coord.y < clickedY + range);

        playerContext.seekTo(playerContext.currentTrack.duration * ClickGridCoordinates.indexOf(validClickCoordinates[0]) / 100);

        if(playerContext.isPaused || playerContext.isStopped) {
            playerContext.play();
        }
    }

    return (
        <>
            <View onTouchStart={(e) => clickProgressBar(e)} style={{ ...styles.grid, width: playerImageSize, height: playerImageSize, borderColor: colors.secondary }}></View>
        </>
    )
}

const styles = StyleSheet.create({
    grid: {
        borderRadius: 500
    }
});

export default Grid;