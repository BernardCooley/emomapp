import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { artistProfileId } from '../Actions/index';

import useFirebaseCall from '../hooks/useFirebaseCall';

const ArtistsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const allArtists = useSelector(state => state.artists);
    const allTracks = useSelector(state => state.tracks);
    const [refreshing, setRefreshing] = React.useState(false);

    const [getArtists, error, getNextArtists] = useFirebaseCall('users', 'userId', 20);

    useEffect(() => {
        getArtists();
    }, [allTracks]);

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

    return (
        <>
            <SafeAreaView style={styles.artistsContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                    }
                    style={styles.listContainer}
                    data={allArtists}
                    renderItem={renderItem}
                    keyExtractor={artist => artist.userId}
                    numColumns={2}
                />
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
    }
});

export default ArtistsScreen;
