import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text } from 'react-native-design-utility';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePlayerContext } from '../contexts/PlayerContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { Avatar, useTheme } from 'react-native-paper';
import { useNavigationContext } from '../contexts/NavigationContext';

const MiniPlayer = () => {
    const navigationContext = useNavigationContext();
    const { colors } = useTheme();
    const navigation = useSelector(state => state.navigation);
    const playerContext = usePlayerContext();

    if (playerContext.isEmpty || !playerContext.currentTrack || navigationContext.currentScreen === 'Music') {
        return null;
    }

    const openPlayer = () => {
        navigation.push('Music');
    }

    return (

        <Box style={{...styles.outerBox, backgroundColor: colors.playerLight}} px='sm'>
            <TouchableOpacity style={styles.imageAndDetails} onPress={openPlayer}>
                <Avatar.Image style={styles.avatar} size={40} source={{
                    uri: playerContext.currentTrack.trackImage
                }} />
                <Box style={styles.titleArtistBox}>
                    <Text style={{color: colors.lightIconsAndText}}>{playerContext.currentTrack.artist}</Text>
                    <Text style={{color: colors.lightIconsAndText}}>{playerContext.currentTrack.title}</Text>
                </Box>
            </TouchableOpacity>
            <Box>
                {playerContext.isPaused &&
                    <TouchableOpacity onPress={() => playerContext.play()}>
                        <MaterialCommunityIcons color={colors.lightIconsAndText} name="play" size={30} />
                    </TouchableOpacity>
                }
                {playerContext.isPlaying &&
                    <TouchableOpacity onPress={playerContext.pause}>
                        <MaterialCommunityIcons color={colors.lightIconsAndText} name="pause" size={30} />
                    </TouchableOpacity>
                }
                {playerContext.isStopped &&
                    <TouchableOpacity onPress={() => playerContext.play()}>
                        <MaterialCommunityIcons color={colors.lightIconsAndText} name="play" size={30} />
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