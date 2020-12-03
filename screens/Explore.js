import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, FAB } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import TracksScreen from '../screens/Tracks';
import ArtistsScreen from '../screens/Artists';
import { setNavigation } from '../Actions/index';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useTracksContext } from '../contexts/TracksContext';

const ExploreScreen = ({ navigation }) => {
    const navigationContext = useNavigationContext();
    const tracksContext = useTracksContext();
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const ExploreTab = createMaterialTopTabNavigator();


    useEffect(() => {
        dispatch(setNavigation(navigation));
    }, []);

    useEffect(() => {
        tracksContext.triggerRefetch(!tracksContext.refetch);
    }, [navigationContext.currentScreen]);

    const artistProfile = () => {
        navigation.push('Account', {
            screen: 'Profile',
            params: {
                artistId: auth().currentUser.uid,
                isLoggedInUser: true
            }
        });
    }

    return (
        <>
            <ExploreTab.Navigator
                tabBarOptions={{
                    indicatorStyle: {
                        backgroundColor: colors.primary
                    },
                    labelStyle: {
                        fontSize: 16
                    }
                }}>
                <ExploreTab.Screen name="Tracks" component={TracksScreen} />
                <ExploreTab.Screen name="Artists" component={ArtistsScreen} />
            </ExploreTab.Navigator>
            {navigationContext.currentScreen !== 'Account' &&
                <FAB
                    animated
                    icon="account-outline"
                    style={{ ...styles.settingsIcon, ...styles.fab, backgroundColor: colors.primary }}
                    onPress={artistProfile}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    settingsIcon: {
        position: 'absolute',
        right: 10,
        bottom: 10
    }
});

export default ExploreScreen;
