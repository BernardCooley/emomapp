import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Box } from 'react-native-design-utility';
import { ActivityIndicator } from 'react-native-paper';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import MainStackNavigator from '../navigation/MainStackNavigation';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { user } from '../Actions/index';

const Main = () => {
    const dispatch = useDispatch();

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        TrackPlayer.setupPlayer().then(() => {
            TrackPlayer.updateOptions({
                stopWithApp: true,
                capabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                    TrackPlayer.CAPABILITY_STOP,
                    TrackPlayer.CAPABILITY_JUMP_FORWARD,
                    TrackPlayer.CAPABILITY_JUMP_BACKWARD,
                    TrackPlayer.CAPABILITY_SEEK_TO,
                    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
                ],
                jumpInterval: 30
            })

            setIsReady(true);
        });
    }, []);

    useEffect(() => {
        auth().onAuthStateChanged(onAuthStateChanged);
    }, []);

    const onAuthStateChanged = (loggedInUser) => {
        dispatch(user(loggedInUser));
    }

    return (
        <>
            {isReady ?
                <PlayerContextProvider>
                    <NavigationContainer>
                        <MainStackNavigator />
                    </NavigationContainer>
                </PlayerContextProvider>
                : (
                    <Box f={1} center>
                        <ActivityIndicator />
                    </Box>
                )}
        </>
    );
}

export default Main;
