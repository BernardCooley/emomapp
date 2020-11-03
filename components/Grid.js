import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { usePlayerContext } from '../contexts/PlayerContext';

import ClickGridCoordinates from '../data/ClickGridCoordinates';

const Grid = () => {
    const range = 10;
    const playerContext = usePlayerContext();
    const playerImageSize = useSelector(state => state.playerImageSize);

    const clickProgressBar = e => {
        clickedOnBar(Math.round(e.nativeEvent.locationX), Math.round(e.nativeEvent.locationY));
    }

    const clickedOnBar = (x, y) => {
        const validClickCoordinates = ClickGridCoordinates.filter(coord => coord.x > x - range && coord.x < x + range && coord.y > y - range && coord.y < y + range);

        const clickedIndex = validClickCoordinates.length === 1 ? ClickGridCoordinates.indexOf(validClickCoordinates[0]) : ClickGridCoordinates.indexOf(getClosest(validClickCoordinates));

        playerContext.seekTo(playerContext.currentTrack.duration * clickedIndex / 100);
    }

    const distance = point => {
        return Math.pow(point.x, 2) + Math.pow(point.y, 2);
    }

    const getClosest = points => {
        const closest = points.slice(1).reduce(function (min, p) {
            if (distance(p) < min.d) min.point = p;
            return min;
        }, { point: points[0], d: distance(points[0]) }).point;

        return closest;
    }

    return (
        <>
            <View onTouchStart={(e) => clickProgressBar(e)} style={{ width: playerImageSize, height: playerImageSize }}></View>
        </>
    )
}

export default Grid;