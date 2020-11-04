import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';

const EmailVerificationScreen = ({ navigation }) => {

    useEffect(() => {

    }, []);

    const resendEmail = async () => {
        await auth().currentUser.sendEmailVerification().then(() => {
            navigation.push('Login', {
                fromVerificationPage: true
            });
        })
    }

    return (
        <View style={styles.container}>
            <Title>Email address not verified</Title>
            <Button onPress={resendEmail} style={styles.resendButton} mode='contained'>Re-send email verification email</Button>
            <Text>or</Text>
            <Button onPress={() => navigation.push('Login', {
                fromVerificationPage: false
            })} style={styles.loginButton}>Login</Button>
        </View>
    )
};

EmailVerificationScreen.propTypes = {

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 200
    },
    loginButton: {

    }
});

export default EmailVerificationScreen;