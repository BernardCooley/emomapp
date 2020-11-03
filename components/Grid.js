import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import ClickGridCoordinates from '../data/ClickGridCoordinates';

const Grid = () => {
    const playerImageSize = useSelector(state => state.playerImageSize);

    const clickProgressBar = e => {
        clickedOnBar(Math.round(e.nativeEvent.locationX), Math.round(e.nativeEvent.locationY));
    }

    const range = 15;

    const clickedOnBar = (x, y) => {
        // console.log(x, y);
        ClickGridCoordinates.forEach((coord, index) => {
            if(coord.x > x - range && coord.x < x + range && coord.y > y - range && coord.y < y + range) {
                console.log('HIT');
                // console.log(coord.x, coord.y);
                // console.log(x, y);
                console.log(index);
            }
        });
    }

    // const circle = (radius, steps, centerX, centerY) => {
    //     const coordinates = [];
    //     var xValues = [centerX];
    //     var yValues = [centerY];
    //     for (var i = 0; i < steps; i++) {
    //         xValues[i] = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
    //         yValues[i] = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
    //         coordinates.push({x: Math.round(centerX + radius * Math.cos(2 * Math.PI * i / steps)), y: Math.round(centerY + radius * Math.sin(2 * Math.PI * i / steps))})
    //     }
    //     console.log(coordinates);
    // }

    // circle(150, 100, 150, 150);

    const Dots = () => {
        const dots = [];
        ClickGridCoordinates.forEach(coord => {
            dots.push(<View style={{...styles.dot, left: coord.x, top: coord.y}}></View>);
        })
        return dots;
    }

    return (
        <>
            <View onTouchEnd={(e) => clickProgressBar(e)} style={{ ...styles.clickBox, width: playerImageSize, height: playerImageSize }}><Dots/></View>
        </>
    )
}

const styles = StyleSheet.create({
    dot: {
        position: 'absolute',
        height: 1,
        width: 1,
        borderWidth: 1
    },
    clickBox: {
        position: 'relative',
        zIndex: 10000,
        borderWidth: 1,
        borderColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Grid;