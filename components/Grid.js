import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { usePlayerContext } from '../contexts/PlayerContext';

import ClickGridCoordinates from '../data/ClickGridCoordinates';

const Grid = () => {
    const playerContext = usePlayerContext();
    const playerImageSize = useSelector(state => state.playerImageSize);

    const clickProgressBar = e => {
        clickedOnBar(Math.round(e.nativeEvent.locationX), Math.round(e.nativeEvent.locationY));
    }

    const range = 10;

    const clickedOnBar = (x, y) => {
        ClickGridCoordinates.forEach((coord, index) => {
            if(coord.x > x - range && coord.x < x + range && coord.y > y - range && coord.y < y + range) {
                playerContext.seekTo(playerContext.currentTrack.duration * index / 100);
                return;
            }
        });
    }

    return (
        <>
            <View onTouchEnd={(e) => clickProgressBar(e)} style={{ width: playerImageSize, height: playerImageSize }}></View>
        </>
    )
}

export default Grid;