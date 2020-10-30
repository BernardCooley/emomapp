 import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';


const AccountScreen = ({navigation}) => {
    const logout = () => {
        auth().signOut().then(() => {
            navigation.navigate('Home');
        });
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Account</Text>

            <Button onPress={() => logout()} mode='text'>Logout</Button>

        </View>
      );
}

const styles = StyleSheet.create({

});

export default AccountScreen;
