import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import MusicPlayer from '../components/MusicPlayer';

const MusicScreen = ({navigation}) => {
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
