import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Snackbar, useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';

import formStyles from '../styles/FormStyles';


const LoginScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { fromVerificationPage, emailFromRoute, passwordFromRoute } = route.params;
    const user = useSelector(state => state.user);

    const emailRef = useRef();
    const passwordRef = useRef();
    const [email, setEmail] = useState(emailFromRoute ? emailFromRoute : '');
    const [password, setPassword] = useState(passwordFromRoute ? passwordFromRoute : '');

    const [formIsValid, setFormIsValid] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');

    const errors = {
        email: {
            valid: false
        },
        password: {
            valid: false
        }
    };

    useEffect(() => {
        if (auth().currentUser && auth().currentUser.emailVerified) {
            navigation.push('Tabs', { screen: 'Explore' });
        }
    }, []);

    useEffect(() => {
        errors.email.valid = /\S+@\S+\.\S+/.test(email);
        errors.password.valid = password.length >= 6;

        errors.email.valid && errors.password.valid ? setFormIsValid(true) : setFormIsValid(false);
    }, [email, password]);

    useEffect(() => {
        if (user) {

        }
    }, [user]);

    const login = async () => {
        await auth().signInWithEmailAndPassword(email, password).then(async () => {
            if (auth().currentUser.emailVerified) {
                navigation.navigate('Tabs', { screen: 'Explore' });
            } else {
                console.log('NOT Verified');
                navigation.push('EmailVerification');
            }
        }).catch(error => {
            if (error.code === 'auth/user-not-found') {
                setSnackBarMessage('Email and/or password incorrect. Please try again')
            }
        });
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput
                        ref={emailRef}
                        style={styles.input}
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                    />
                    <TextInput
                        ref={passwordRef}
                        style={styles.input}
                        label="Password"
                        value={password}
                        onChangeText={password => setPassword(password)}
                        secureTextEntry={true}
                    />
                    <Button disabled={!formIsValid} style={styles.button} mode="contained" onPress={login}>
                        Log in
                    </Button>
                    <View style={styles.forgotPasswordButtonContainer}>
                        <Button style={styles.forgotPasswordButton} onPress={() => navigation.push('ForgotPassword', {
                            emailFromLogin: email
                        })}>Fogot password</Button>
                    </View>
                    {fromVerificationPage &&
                        <Text style={{ ...styles.verificationLabel, color: colors.primary }}>Email verification email sent.</Text>
                    }
                </View>
                <View style={styles.registerLinkContainer}>
                    <Text style={styles.registerText}>Dont have an accout?.....</Text>
                    <Button style={styles.registerLink} mode="text" onPress={() => navigation.push('Register')}>
                        register
                            </Button>
                </View>
            </View>
            <Snackbar
                visible={snackBarMessage.length > 0}
                onDismiss={() => setSnackBarMessage('')}>
                {snackBarMessage}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    ...formStyles,
    forgotPasswordButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    forgotPasswordButton: {
        marginTop: 100
    }
});

export default LoginScreen;
