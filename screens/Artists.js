import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, RefreshControl, Keyboard, View } from 'react-native';
import { Card, Title, Chip, Searchbar, ActivityIndicator, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import { artistProfileId, setActivityIndicator, setSnackbarMessage, artists } from '../Actions/index';
import useFirebaseCall from '../hooks/useFirebaseCall';

const ArtistsScreen = ({ navigation }) => {
    const activityIndicator = useSelector(state => state.activityIndicator);
    const dispatch = useDispatch();
    const allArtists = useSelector(state => state.artists);
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const usersRef = firestore().collection('users');

    const [getArtists, error, getNextArtists, getTrackImages] = useFirebaseCall('users', 'artistName', 20);

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
    };

    const viewArtistProfile = artistId => {
        dispatch(artistProfileId(artistId));
        navigation.navigate('Profile');
    }

    const viewArtistTracks = artistId => {
        alert(artistId);
    }

    const renderItem = ({ item }) => (
        <Card style={styles.card} onPress={() => viewArtistProfile(item.userId)}>
            <Chip style={styles.chip} icon="music-box-multiple" onPress={() => viewArtistTracks(item.userId)}>{item.trackAmount}</Chip>
            <Card.Cover style={styles.cardCover} source={{ uri: item.artistImageUrl }} />
            <Title style={styles.cardTitle}>{item.artistName}</Title>
        </Card>
    );

    const onChangeSearch = query => {
        setSearchQuery(query);
    };

    const contains = (string, substring) => {
        return string.toLowerCase().indexOf(substring) !== -1;
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
            });

            setSearchQuery('');
        } else {
            dispatch(setSnackbarMessage(`Search box is empty`));
        }
    }

    return (
        <>
            <SafeAreaView style={styles.artistsContainer}>
                {allArtists.length > 0 ?
                    <>
                        {activityIndicator ?
                            <ActivityIndicator style={styles.activityIndicatorContainer} size='large' /> :
                            <FlatList
                                ListHeaderComponent={
                                    <Searchbar
                                        icon='magnify'
                                        onIconPress={search}
                                        clearIcon='close'
                                        placeholder="Search artists"
                                        onChangeText={onChangeSearch}
                                        value={searchQuery}
                                        onSubmitEditing={search}
                                    />
                                }
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                                }
                                style={styles.listContainer}
                                data={allArtists}
                                renderItem={renderItem}
                                keyExtractor={artist => artist.userId}
                                numColumns={2}
                            />
                        }
                    </> :
                    <>
                        <IconButton style={{ ...styles.backIcon }} onPress={() => navigation.push('ExploreTabs', { screen: 'Artists' })} animated icon="keyboard-backspace" size={30} />
                        <View style={styles.noArtistsLabel}>
                            <Title >No artists found</Title>
                        </View>
                    </>
                }
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    artistsContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    card: {
        height: 'auto',
        width: '45%',
        margin: 10
    },
    cardTitle: {
        textAlign: 'center',
        width: '100%',
        backgroundColor: 'rgba(53, 53, 53, 0.94)',
        color: 'white',
        height: 'auto'
    },
    chip: {
        position: 'absolute',
        top: 5,
        left: 5,
        zIndex: 1,
        width: 50
    },
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
    backIcon: {
        position: 'absolute',
        left: 0,
        top: 0
    }
});

export default ArtistsScreen;
