import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, FAB } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';

import TracksScreen from '../screens/Tracks';
import ArtistsScreen from '../screens/Artists';
import { setNavigation } from '../Actions/index';
import { useSelector } from 'react-redux';

const ExploreScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const ExploreTab = createMaterialTopTabNavigator();
    const currScreen = useSelector(state => state.currentScreen);


    useEffect(() => {
        dispatch(setNavigation(navigation));
    }, [])

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
                    small
                    icon="account-outline"
                    style={{...styles.settingsIcon, ...styles.fab, backgroundColor: colors.lightIconsAndText}}
                    onPress={() => navigation.navigate('Account')}
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
