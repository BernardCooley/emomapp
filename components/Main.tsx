import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Box } from 'react-native-design-utility';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { NavigationContextProvider } from '../contexts/NavigationContext';
import MainStackNavigator from '../navigation/MainStackNavigation';
import { useDispatch } from 'react-redux';
import { useNavigationContext } from '../contexts/NavigationContext';

const Main = () => {
    const navigationContext = useNavigationContext();
    const routeNameRef = useRef();
    const navigationRef = useRef();
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

    return (
        <>
            {isReady ?
                <NavigationContextProvider>
                    <PlayerContextProvider>
                        <NavigationContainer
                            ref={navigationRef}
                            onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                            onStateChange={() => {
                                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                                navigationContext.updateCurrentScreen(currentRouteName);
                                routeNameRef.current = currentRouteName;
                            }}>
                            <Snackbar
                                visible={navigationContext.snackbarMessage.length > 0}
                                duration={2000}
                                onDismiss={() => navigationContext.updateSnackbarMessage('')}>
                                {navigationContext.snackbarMessage}
                            </Snackbar>
                            <MainStackNavigator />
                        </NavigationContainer>
                    </PlayerContextProvider>
                </NavigationContextProvider>
                : (
                    <Box f={1} center>
                        <ActivityIndicator size='large' />
                    </Box>
                )}
        </>
    );
}

export default Main;
