import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import { TextInput, Button, Text, Snackbar, Paragraph, Title } from 'react-native-paper';
import auth from '@react-native-firebase/auth';


const HomeScreen = ({ navigation }) => {

    useEffect(() => {
        if (auth().currentUser) {
            navigation.navigate('Tabs', { screen: 'Explore' });
        }
    }, []);

    return (
        <View style={styles.screenContainer}>
            <ImageBackground blurRadius={2} source={require('../assets/images/event_1.jpg')} style={styles.image}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Title style={styles.title}>EMOM</Title>
                        <Text style={styles.description}>The electronic music open mic community</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => navigation.navigate('Login')} mode='contained'>Log in</Button>
                        <Button style={styles.button} onPress={() => navigation.navigate('Register')} mode='contained'>Register</Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100
    },
    title: {
        color: 'white',
        fontSize: 50,
        paddingTop: 50
    },
    description: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 30
    },
    screenContainer: {
        flex: 1,
        flexDirection: "column"
    },
    container: {
        flex: 1,
        position: 'relative',
        zIndex: 10
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        height: 37,
        margin: 20,
        width: 120
    }
});

export default HomeScreen;
