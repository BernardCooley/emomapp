import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, IconButton, TextInput, Snackbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import formStyles from '../styles/FormStyles';

const ForgotPasswordScreen = ({ navigation, route }) => {
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const { emailFromLogin } = route.params;
    const [email, setEmail] = useState(emailFromLogin ? emailFromLogin : '');
    const [formIsValid, setFormIsValid] = useState(false);

    const resetPassword = () => {
        auth().sendPasswordResetEmail(email).then(function () {
            setSnackBarMessage(`Password rest email sent to: ${email}`);
            navigation.push('Login', {
                emailFromRoute: email
            });
        }).catch(function (error) {
            if (error.code === 'auth/user-not-found') {
                setSnackBarMessage('Email address doesnt exist. Please try again.')
            }
            console.log('PASSWORD RESET EMAIL ===============>', error);
        });
    }

    useEffect(() => {
        /\S+@\S+\.\S+/.test(email) ? setFormIsValid(true) : setFormIsValid(false);
    }, [email]);

    return (
        <View style={styles.container}>
            <View style={styles.backToLoginContainer}>
                <IconButton onPress={() => navigation.goBack()} animated icon="keyboard-backspace" size={30} />
                <Text>Back to login</Text>
            </View>
            <TextInput
                style={styles.input}
                label="Email"
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <Button disabled={!formIsValid} style={{ ...styles.button, ...styles.forgotPasswordButton }} mode="contained" onPress={resetPassword}>
                Reset password
            </Button>
            <Snackbar
                visible={snackBarMessage.length > 0}
                onDismiss={() => setSnackBarMessage('')}>
                {snackBarMessage}
            </Snackbar>
        </View>
    )
};

ForgotPasswordScreen.propTypes = {

};

const styles = StyleSheet.create({
    ...formStyles,
    backToLoginContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});

export default ForgotPasswordScreen;