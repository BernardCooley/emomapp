import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, BackHandler, Alert, ScrollView, RefreshControl, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import TracksList from '../components/TracksList';
import PropTypes from 'prop-types';
import { Searchbar, ActivityIndicator, Title, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import useFirebaseCall from '../hooks/useFirebaseCall';
import { setActivityIndicator, setSnackbarMessage } from '../Actions/index';


const TracksScreen = ({ navigation }) => {
    const tracksRef = firestore().collection('tracks');
    const dispatch = useDispatch();
    const activityIndicator = useSelector(state => state.activityIndicator);
    const allTracks = useSelector(state => state.tracks);
    const [getTracks, error, getNextTracks, getTrackImages] = useFirebaseCall('tracks', 'id', 20);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showingSearchResults, setShowingSearchResults] = useState(false);

    useEffect(() => {
        if(searchQuery.length === 0) {
            refresh();
        }
    }, [searchQuery]);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = () => {
        setRefreshing(true);
        getTracks();
        wait(2000).then(() => setRefreshing(false));
        setShowingSearchResults(false);
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

    const onChangeSearch = query => {
        setSearchQuery(query);
    };

    const contains = (string, substring) => {
        return string.toLowerCase().indexOf(substring.toLowerCase()) !== -1;
    }

    const search = async () => {
        if (searchQuery.length > 0) {
            Keyboard.dismiss();
            dispatch(setActivityIndicator(true));

            await tracksRef.get().then(response => {
                const allTracks = response.docs.map(doc => doc.data());
                const filteredTracks = allTracks.filter(track => contains(track.artist, searchQuery) || contains(track.title, searchQuery));

                setShowingSearchResults(true);
                getTrackImages(filteredTracks);
            });
        } else {
            dispatch(setSnackbarMessage(`Search box is empty`));
        }
    }

    return (
        <>
            {allTracks &&
                <SafeAreaView style={styles.container}>
                    <Searchbar
                        icon='magnify'
                        onIconPress={search}
                        clearIcon='close'
                        placeholder="Search tracks"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        onSubmitEditing={search}
                    />
                    {activityIndicator ?
                        <ActivityIndicator style={styles.activityIndicatorContainer} size='large' /> :
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                            }
                            style={styles.scrollView} contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}>
                            {showingSearchResults &&
                                <Text style={styles.resultsLabel}>{allTracks.length} results found for: "{searchQuery}"</Text>
                            }
                            {allTracks.length > 0 ?
                                <TracksList tracks={allTracks} navigation={navigation} /> :
                                <>
                                    <View style={styles.noTracksLabel}>
                                        <Title >No tracks found</Title>
                                    </View>
                                </>
                            }
                        </ScrollView>
                    }
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
    },
    activityIndicatorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    noTracksLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
    },
    backIcon: {
        position: 'absolute',
        left: 0,
        top: 0
    },
    resultsLabel: {
        fontWeight: 'bold',
        padding: 10
    }
});

export default TracksScreen;
