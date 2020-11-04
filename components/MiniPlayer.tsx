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
    const navigation = useSelector(state => state.navigation);
    const playerContext = usePlayerContext();

    if (playerContext.isEmpty || !playerContext.currentTrack || currentScreen === 'Music') {
        return null;
    }

    const openPlayer = () => {
        navigation.navigate('Tabs', { screen: 'Music' });
    }

    return (

        <Box style={styles.outerBox} px='sm'>
            <TouchableOpacity style={styles.imageAndDetails} onPress={openPlayer}>
                <Avatar.Image style={styles.avatar} size={40} source={{
                    uri: playerContext.currentTrack.trackImage
                }} />
                <Box style={styles.titleArtistBox}>
                    <Text>{playerContext.currentTrack.artist}</Text>
                    <Text>{playerContext.currentTrack.title}</Text>
                </Box>
            </TouchableOpacity>
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

    )
}

const styles = StyleSheet.create({
    imageAndDetails: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    outerBox: {
        height: 75,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    titleArtistBox: {
        display: 'flex',
    },
    avatar: {
        marginRight: 10
    }
});

export default MiniPlayer;