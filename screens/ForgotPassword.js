import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Button, Text, IconButton, TextInput, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import formStyles from '../styles/FormStyles';
import { useNavigationContext } from '../contexts/NavigationContext';

const ForgotPasswordScreen = ({ navigation, route }) => {
    const navigationContext = useNavigationContext();
    const { emailFromLogin } = route.params;
    const [email, setEmail] = useState(emailFromLogin ? emailFromLogin : '');
    const [formIsValid, setFormIsValid] = useState(false);

    const resetPassword = () => {
        Keyboard.dismiss();
        navigationContext.updateActivityIndicator(true);
        auth().sendPasswordResetEmail(email).then(function () {
            navigationContext.updateSnackbarMessage(`Password reset email sent to: ${email}`);
            navigation.push('Login', {
                emailFromRoute: email
            });
            navigationContext.updateActivityIndicator(false);
        }).catch(function (error) {
            if (error.code === 'auth/user-not-found') {
                navigationContext.updateSnackbarMessage('Email address doesnt exist. Please try again.');
            }
            console.log('PASSWORD RESET EMAIL ===============>', error);
        });
    }

    useEffect(() => {
        /\S+@\S+\.\S+/.test(email) ? setFormIsValid(true) : setFormIsValid(false);
    }, [email]);

    return (
        <>
            {navigationContext.activityIndicator ?
                <ActivityIndicator style={styles.activityIndicatorContainer} size='large' /> :
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
                </View>
            }
        </>
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
    },
    activityIndicatorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
});

export default ForgotPasswordScreen;