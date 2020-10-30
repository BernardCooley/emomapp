import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';

import TracksScreen from '../screens/Tracks';
import ArtistsScreen from '../screens/Artists';

const ExploreScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const ExploreTab = createMaterialTopTabNavigator();

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
