import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { currentScreen } from '../Actions/index';
import PropTypes from 'prop-types';

import MusicPlayer from '../components/MusicPlayer';

const MusicScreen = ({navigation}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(currentScreen('Music'));
        });

        return(() => {
            unsubscribe()
        })
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            dispatch(currentScreen(''));
        });

        return (() => {
            unsubscribe()
        })
    }, [navigation]);

    return (
        <View style={styles.playerContainer}>
            <MusicPlayer navigation={navigation}/>
        </View>
      );
}

MusicScreen.propTypes = {
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    playerContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

export default MusicScreen;
