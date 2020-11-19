import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Button, Text, IconButton, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';

const AccountSettings = ({navigation}) => {
    const [state, setState] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {

    }, []);

    const logout = () => {
        auth().signOut().then(() => {
            navigation.navigate('Home');
        });
    }

    return (
        <View style={styles.container}>
            <Button onPress={() => logout()} mode='text'>Logout</Button>
        </View>
    )
};

AccountSettings.propTypes = {

};

const styles = StyleSheet.create({

});

export default AccountSettings;