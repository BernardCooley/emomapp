 import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import ArtistProfileScreen from '../screens/ArtistProfile';
import AccountSettings from '../screens/AccountSettings';


const AccountScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const AccountTab = createMaterialTopTabNavigator();

    return (
        <>
            <AccountTab.Navigator
                tabBarOptions={{
                    indicatorStyle: {
                        backgroundColor: colors.primary
                    },
                    labelStyle: {
                        fontSize: 16
                    }
                }}>
                <AccountTab.Screen name="Profile" component={ArtistProfileScreen} initialParams={{ artistId: '' }} />
                <AccountTab.Screen name="Account" component={AccountSettings} />
            </AccountTab.Navigator>
        </>
      );
}

const styles = StyleSheet.create({

});

export default AccountScreen;
