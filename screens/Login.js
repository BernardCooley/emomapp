import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import formStyles from '../styles/FormStyles';
import { useNavigationContext } from '../contexts/NavigationContext';


const LoginScreen = ({ route, navigation }) => {
    const navigationContext = useNavigationContext();
    const { fromVerificationPage, emailFromRoute, passwordFromRoute } = route.params;
    const emailRef = useRef();
    const passwordRef = useRef();
    const [email, setEmail] = useState(emailFromRoute ? emailFromRoute : '');
    const [password, setPassword] = useState(passwordFromRoute ? passwordFromRoute : '');
    const [formIsValid, setFormIsValid] = useState(false);

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
        if (fromVerificationPage) {
            navigationContext.updateSnackbarMessage('Verification email sent');
        }
    }, []);

    useEffect(() => {
        errors.email.valid = /\S+@\S+\.\S+/.test(email);
        errors.password.valid = password.length >= 6;

        errors.email.valid && errors.password.valid ? setFormIsValid(true) : setFormIsValid(false);
    }, [email, password]);

    const login = async () => {
        Keyboard.dismiss();
        navigationContext.updateActivityIndicator(true);
        await auth().signInWithEmailAndPassword(email, password).then(async () => {
            if (auth().currentUser.emailVerified) {
                navigation.navigate('Tabs', { screen: 'Explore' });
            } else {
                console.log('NOT Verified');
                navigation.push('EmailVerification');
            }
            navigationContext.updateActivityIndicator(false);
        }).catch(error => {
            if (error.code === 'auth/user-not-found') {
                navigationContext.updateSnackbarMessage('Email and/or password incorrect. Please try again');
            }
        });
    }

    return (
        <>
            {navigationContext.activityIndicator ?
                <ActivityIndicator style={styles.activityIndicatorContainer} size='large' />
                :
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
                            })}>Forgot password</Button>
                        </View>
                    </View>
                    <View style={styles.registerLinkContainer}>
                        <Text style={styles.registerText}>Dont have an accout?.....</Text>
                        <Button style={styles.registerLink} mode="text" onPress={() => navigation.push('Register')}>
                            register
                            </Button>
                    </View>
                </View>
            }
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
    },
    activityIndicatorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
});

export default LoginScreen;
