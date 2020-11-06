import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigation';
import ExploreScreen from '../screens/Explore';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ArtistProfileScreen from '../screens/ArtistProfile';
import HomeScreen from '../screens/Home';
import MusicScreen from '../screens/Music';
import EmailVerificationScreen from '../screens/EmailVerification';
import ForgotPasswordScreen from '../screens/ForgotPassword';

const MainStack = createStackNavigator();

const MainStackNavigator = () => {

    return (
        <MainStack.Navigator headerMode='none'>
            <MainStack.Screen name='Home' component={HomeScreen} />
            <MainStack.Screen name='Login' component={LoginScreen}
                initialParams={{ fromVerificationPage: false, loginDetails: {} }} />
            <MainStack.Screen name='Register' component={RegisterScreen} />
            <MainStack.Screen name='ForgotPassword' component={ForgotPasswordScreen}
                initialParams={{ emailAddress: '' }} />
            <MainStack.Screen name='EmailVerification' component={EmailVerificationScreen}
                initialParams={{ loginDetails: {} }} />
            <MainStack.Screen name='Tabs' component={MainTabNavigator} />
            <MainStack.Screen name='ExploreTabs' component={ExploreScreen} />
            <MainStack.Screen name='Music' component={MusicScreen} />
            <MainStack.Screen name="Profile" component={ArtistProfileScreen} initialParams={{ artistId: '' }} />
        </MainStack.Navigator>
    )
}

export default MainStackNavigator;