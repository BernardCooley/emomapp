import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, BackHandler, Alert, SafeAreaView, RefreshControl, Keyboard, View, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from 'prop-types';
import { Title, Searchbar, ActivityIndicator, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import useFirebaseCall from '../hooks/useFirebaseCall';
import { setActivityIndicator, setSnackbarMessage, artists } from '../Actions/index';
import ArtistsList from '../components/ArtistsList';
import TracksList from '../components/TracksList';


const TracksAndArtists = ({ navigation, artistsOrTracks }) => {
    const dispatch = useDispatch();
    const activityIndicator = useSelector(state => state.activityIndicator);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showingSearchResults, setShowingSearchResults] = useState(false);
    const [getArtists, artistsError, getNextArtists] = useFirebaseCall('users', 'artistName', 20);
    const [getTracks, tracksError, getNextTracks, getTrackImages] = useFirebaseCall('tracks', 'id', 20);

    let firestoreRef = null;
    let allData = null;

    if (artistsOrTracks === 'artists') {
        firestoreRef = firestore().collection('users');
        allData = useSelector(state => state.artists);
    } else {
        firestoreRef = firestore().collection('tracks');
        allData = useSelector(state => state.tracks);
    }

    useEffect(() => {
        if (searchQuery.length === 0) {
            refresh();
        }
    }, [searchQuery]);

    useEffect(() => {

    }, []);

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

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = () => {
        setSearchQuery('');
        setRefreshing(true);
        if (artistsOrTracks === 'artists') {
            getArtists();   
        } else {
           getTracks();
        }
        wait(2000).then(() => setRefreshing(false));
        setShowingSearchResults(false);
    };

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

            await firestoreRef.get().then(response => {
                const allData = response.docs.map(doc => doc.data());
                let filteredData = [];

                if (artistsOrTracks === 'artists') {
                    filteredData = allData.filter(artist => contains(artist.artistName, searchQuery));
                    dispatch(artists(filteredData));
                    dispatch(artists(filteredData));
                    dispatch(setActivityIndicator(false));
                } else {
                    filteredData = allData.filter(track => contains(track.artist, searchQuery) || contains(track.title, searchQuery));
                    getTrackImages(filteredData);
                }

                setShowingSearchResults(true);
            });

        } else {
            dispatch(setSnackbarMessage(`Search box is empty`));
        }
    }

    return (
        <>
            {allData &&
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
                                <Text style={styles.resultsLabel}>{allData.length} results found for: "{searchQuery}"</Text>
                            }
                            {allData.length > 0 ?
                                <>
                                    {artistsOrTracks === 'artists' ?
                                        <ArtistsList navigation={navigation}/> :
                                        <TracksList tracks={allData} navigation={navigation} />
                                    }
                                </> :
                                <>
                                    <View style={styles.noResultsLabel}>
                                        <Title >No tracks found</Title>
                                    </View>
                                </>
                            }
                        </ScrollView>
                    }
                </SafeAreaView>
            }
        </>
    )
};

TracksAndArtists.propTypes = {
    tracks: PropTypes.object,
    navigation: PropTypes.object
};

const styles = StyleSheet.create({
    noResultsLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
    },
    activityIndicatorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    resultsLabel: {
        fontWeight: 'bold',
        padding: 10
    }
});

export default TracksAndArtists;