import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigation';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ArtistProfileScreen from '../screens/ArtistProfile';
import HomeScreen from '../screens/Home';

const MainStack = createStackNavigator();

const MainStackNavigator = () => {

    return (
        <MainStack.Navigator headerMode='none'>
            <MainStack.Screen name='Home' component={HomeScreen} />
            <MainStack.Screen name='Login' component={LoginScreen} />
            <MainStack.Screen name='Register' component={RegisterScreen} />
            <MainStack.Screen name='Tabs' component={MainTabNavigator} />
            <MainStack.Screen name="Profile" component={ArtistProfileScreen} />
        </MainStack.Navigator>
    )
}

export default MainStackNavigator;