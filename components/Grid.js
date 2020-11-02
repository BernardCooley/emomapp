import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePlayerContext } from '../contexts/PlayerContext';

const Grid = () => {
    const size = 360;
    const cellAmount = 20;
    const grid = { 0: [0, 10], 2: [0, 11], 3: [0, 12], 4: [0, 13], 5: [0, 14], 6: [1, 14], 8: [1, 15], 9: [1, 16], 10: [2, 16], 11: [2, 17], 12: [3, 17], 13: [3, 18], 14: [4, 18], 16: [5, 18], 17: [5, 19], 18: [6, 19], 20: [7, 19], 22: [8, 19], 23: [9, 19], 25: [10, 19], 27: [11, 19], 29: [12, 19], 31: [13, 19], 32: [14, 19], 33: [14, 18], 35: [15, 18], 36: [16, 18], 37: [16, 17], 38: [17, 17], 39: [17, 16], 40: [18, 16], 41: [18, 15], 42: [18, 14], 43: [19, 14], 44: [19, 13], 45: [19, 12], 47: [19, 11], 48: [19, 11], 48: [19, 10], 50: [19, 9], 52: [19, 8], 53: [19, 7], 54: [19, 6], 55: [19, 5], 56: [18, 5], 58: [18, 4], 59: [18, 3], 60: [17, 3], 61: [17, 2], 62: [16, 2], 63: [16, 1], 64: [15, 1], 66: [14, 1], 67: [14, 0], 68: [13, 0], 70: [12, 0], 72: [11, 0], 73: [10, 0], 75: [9, 0], 77: [8, 0], 79: [7, 0], 80: [6, 0], 81: [5, 0], 83: [5, 1], 84: [4, 1], 85: [3, 1], 86: [3, 2], 87: [2, 2], 88: [2, 3], 89: [1, 3], 90: [1, 4], 92: [1, 5], 93: [0, 5], 96: [0, 7], 98: [0, 8], 99: [0, 9], 94: [0, 6] }
    const playerContext = usePlayerContext();

    const matrix = new Array(cellAmount).fill(0).map(() => new Array(cellAmount).fill(0));

    const registerClick = coordinates => {
        Object.keys(grid).forEach(g => {
            if (grid[g].every((val, index) => val === coordinates[index])) {
                // console.log(g);
                playerContext.seekTo(playerContext.currentTrack.duration * g / 100)
            }
        })
    }

    return (
        <>
            {matrix.map((row, index) => (
                <TouchableOpacity key={index} style={{ ...styles.boxRow, width: size, height: size / cellAmount }}>
                    {
                        row.map((cell, i) => (
                            <TouchableOpacity key={`${index}${i}`} onPress={() => registerClick([index, i])} style={{ ...styles.cell, width: size / cellAmount, height: size / cellAmount }}></TouchableOpacity>
                        ))
                    }
                </TouchableOpacity>
            ))
            }
        </>
    )
}

const styles = StyleSheet.create({
    boxRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    cell: {
        position: 'relative',
        zIndex: 30
    }
});

export default Grid;