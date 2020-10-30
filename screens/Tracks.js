import React, { useCallback } from 'react';
import { StyleSheet, SafeAreaView, BackHandler, Alert, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import TracksList from '../components/TracksList';
import PropTypes from 'prop-types';

import useFirebaseCall from '../hooks/useFirebaseCall';


const TracksScreen = ({ navigation }) => {
    const allTracks = useSelector(state => state.tracks);
    const [getTracks, error, getNextTracks] = useFirebaseCall('tracks', 'id', 20);
    const [refreshing, setRefreshing] = React.useState(false);


    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = () => {
        setRefreshing(true);
        getTracks();
        wait(2000).then(() => setRefreshing(false));
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Exit app", "Are you sure you want to exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, [])
    );

    return (
        <>
            {allTracks &&
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                        }
                        style={styles.scrollView} contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'space-between'
                        }}>
                        <TracksList tracks={allTracks} navigation={navigation} />
                    </ScrollView>
                </SafeAreaView>
            }
        </>
    );
}

TracksScreen.propTypes = {
    tracks: PropTypes.object,
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    listItem: {
        width: '100%',
        height: 80
    },
    trackImage: {
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
});

export default TracksScreen;
