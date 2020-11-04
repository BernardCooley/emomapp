import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import TracksScreen from '../screens/Tracks';
import ArtistsScreen from '../screens/Artists';
import { setNavigation } from '../Actions/index';

const ExploreScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const ExploreTab = createMaterialTopTabNavigator();

    useEffect(() => {
        dispatch(setNavigation(navigation));
    }, [])

    return (
        <ExploreTab.Navigator
            tabBarOptions={{
                indicatorStyle: {
                    backgroundColor: colors.primary
                }
            }}>
            <ExploreTab.Screen name="Tracks" component={TracksScreen} />
            <ExploreTab.Screen name="Artists" component={ArtistsScreen} />
        </ExploreTab.Navigator>
    );
}

export default ExploreScreen;
