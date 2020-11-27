import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import TracksScreen from '../screens/Tracks';
import ArtistsScreen from '../screens/Artists';
import { setNavigation } from '../Actions/index';

const ExploreScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const ExploreTab = createMaterialTopTabNavigator();
    const currScreen = useSelector(state => state.currentScreen);


    useEffect(() => {
        dispatch(setNavigation(navigation));
    }, []);

    const artistProfile = () => {
        navigation.push('Profile', {
            artistId: auth().currentUser.uid
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
            {currScreen !== 'Account' &&
                <FAB
                    animated
                    icon="account-outline"
                    style={{...styles.settingsIcon, ...styles.fab, backgroundColor: colors.primary}}
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
