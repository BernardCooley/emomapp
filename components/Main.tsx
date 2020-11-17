import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Box } from 'react-native-design-utility';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import MainStackNavigator from '../navigation/MainStackNavigation';
import { useSelector, useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { user, currentScreen, setSnackbarMessage } from '../Actions/index';

const Main = () => {
    const routeNameRef = useRef();
    const navigationRef = useRef();
    const dispatch = useDispatch();
    const snackbarMessage = useSelector(state => state.snackbarMessage);

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
                    <NavigationContainer
                        ref={navigationRef}
                        onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                        onStateChange={() => {
                            const currentRouteName = navigationRef.current.getCurrentRoute().name
                            dispatch(currentScreen(currentRouteName));
                            routeNameRef.current = currentRouteName;
                        }}>
                        <Snackbar
                            visible={snackbarMessage.length > 0}
                            duration={2000}
                            onDismiss={() => dispatch(setSnackbarMessage(''))}>
                            {snackbarMessage}
                        </Snackbar>
                        <MainStackNavigator />
                    </NavigationContainer>
                </PlayerContextProvider>
                : (
                    <Box f={1} center>
                        <ActivityIndicator size='large' />
                    </Box>
                )}
        </>
    );
}

export default Main;
