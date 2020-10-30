import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text } from 'react-native-design-utility';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePlayerContext } from '../contexts/PlayerContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-paper';

const MiniPlayer = () => {
    const currentScreen = useSelector(state => state.currentScreen);
    const playerContext = usePlayerContext();

    if (playerContext.isEmpty || !playerContext.currentTrack || currentScreen === 'Music') {
        return null;
    }

    return (
        <Box style={styles.outerBox} px='sm'>
            <Box style={styles.innerBox}>
                <Avatar.Image style={styles.avatar} size={40} source={{
                    uri: playerContext.currentTrack.trackImage
                }} />
                <Box style={styles.titleArtistBox}>
                    <Text>{playerContext.currentTrack.artist}</Text>
                    <Text>{playerContext.currentTrack.title}</Text>
                </Box>
                <Box>
                    {playerContext.isPaused && 
                        <TouchableOpacity onPress={() => playerContext.play()}>
                            <MaterialCommunityIcons name="play" size={30} />
                        </TouchableOpacity>
                    }
                    {playerContext.isPlaying && 
                        <TouchableOpacity onPress={playerContext.pause}>
                            <MaterialCommunityIcons name="pause" size={30} />
                        </TouchableOpacity>
                    }
                    {playerContext.isStopped && 
                        <TouchableOpacity onPress={() => playerContext.play()}>
                            <MaterialCommunityIcons name="play" size={30} />
                        </TouchableOpacity>
                    }
                </Box>
            </Box>
        </Box>
    )
}

const styles = StyleSheet.create({
    outerBox: {
        height: 75,
        backgroundColor:'white'
    },
    innerBox: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    titleArtistBox: {
        flex: 1
    },
    avatar: {
        marginRight: 10
    }
});

export default MiniPlayer;