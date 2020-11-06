import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, RefreshControl, Keyboard, View, ScrollView } from 'react-native';
import { Title, Searchbar, ActivityIndicator, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

import { setActivityIndicator, setSnackbarMessage, artists } from '../Actions/index';
import useFirebaseCall from '../hooks/useFirebaseCall';
import ArtistsList from '../components/ArtistsList';

const ArtistsScreen = ({ navigation }) => {
    const activityIndicator = useSelector(state => state.activityIndicator);
    const dispatch = useDispatch();
    const allArtists = useSelector(state => state.artists);
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const usersRef = firestore().collection('users');
    const [showingSearchResults, setShowingSearchResults] = useState(false);

    const [getArtists, error, getNextArtists, getTrackImages] = useFirebaseCall('users', 'artistName', 20);

    useEffect(() => {
        if(searchQuery.length === 0) {
            refresh();
        }
    }, [searchQuery]);

    useEffect(() => {
        getArtists();
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = () => {
        setRefreshing(true);
        getArtists();
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

            await usersRef.get().then(response => {
                const allArtists = response.docs.map(doc => doc.data());
                const filteredArtists = allArtists.filter(artist => contains(artist.artistName, searchQuery));
                dispatch(artists(filteredArtists));
                dispatch(setActivityIndicator(false));
                setShowingSearchResults(true);
            });
        } else {
            dispatch(setSnackbarMessage(`Search box is empty`));
        }
    }

    return (
        <>
            {allArtists &&
                <SafeAreaView style={styles.container}>
                    <Searchbar
                        icon='magnify'
                        onIconPress={search}
                        clearIcon='close'
                        placeholder="Search artists"
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
                                <Text style={styles.resultsLabel}>{allArtists.length} results found for: "{searchQuery}"</Text>
                            }
                            {allArtists.length > 0 ?
                                <ArtistsList navigation={navigation}/> :
                                <>
                                    <View style={styles.noArtistsLabel}>
                                        <Title >No artists found</Title>
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

ArtistsScreen.propTypes = {
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    noArtistsLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
    },
    resultsLabel: {
        fontWeight: 'bold',
        padding: 10
    }
});

export default ArtistsScreen;
