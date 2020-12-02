import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';

import ArtistProfileScreen from '../screens/ArtistProfile';
import AccountSettings from '../screens/AccountSettings';


const AccountScreen = ({ navigation }) => {
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
                <AccountTab.Screen name="Profile" component={ArtistProfileScreen} initialParams={{
                    artistId: '',
                    isLoggedInUser: false
                }} />
                <AccountTab.Screen name="Account" component={AccountSettings} />
            </AccountTab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({

});

export default AccountScreen;
