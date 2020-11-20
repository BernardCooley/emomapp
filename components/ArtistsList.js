import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Card, Chip } from 'react-native-paper';

import FilterSortArtists from './FilterSortArtists';


const ArtistsList = ({ navigation, artists }) => {
    const viewArtistProfile = id => {
        navigation.push('Profile', {
            artistId: id
        });
    }

    const viewArtistTracks = artistId => {
        alert(artistId);
    }

    const getArtistImageUrl = (artistId, imageName) => {
        const baseStorageUrl = 'https://storage.googleapis.com/emom-files/';
        return `${baseStorageUrl}${artistId}/${imageName}`;
    }

    const Artists = () => (
        <>
            {
                artists && artists.artists.map((artist, index) => (
                    <View style={styles.artistContainer} key={index}>
                        <Card style={styles.card} onPress={() => viewArtistProfile(artist.id)}>
                            <Chip style={styles.chip} icon="music-box-multiple" onPress={() => viewArtistTracks(artist.id)}>{artist.trackAmount}</Chip>
                            <Card.Cover style={styles.cardCover} source={{ uri: getArtistImageUrl(artist.id, artist.artistImageName) }} />
                            <Title style={styles.cardTitle}>{artist.artistName}</Title>
                        </Card>
                    </View>
                ))
            }
        </>
    );

    return (
        <View style={styles.artistListContainer}>
            <Artists />
            <FilterSortArtists/>
        </View>
    )
};

const styles = StyleSheet.create({
    artistListContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    artistContainer: {
        width: '44.9%',
        height: 'auto',
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

export default ArtistsList;