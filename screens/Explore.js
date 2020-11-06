import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, IconButton } from 'react-native-paper';
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
                    }
                }}>
                <ExploreTab.Screen name="Tracks" component={TracksScreen} />
                <ExploreTab.Screen name="Artists" component={ArtistsScreen} />
            </ExploreTab.Navigator>
            {currScreen !== 'Account' &&
                <IconButton style={styles.settingsIcon} onPress={() => navigation.navigate('Account')} animated icon="cog-outline" size={30} />
            }
        </>
    );
}

const styles = StyleSheet.create({
    settingsIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0
    }
});

export default ExploreScreen;
