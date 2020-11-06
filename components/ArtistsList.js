import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Card, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';


const ArtistsList = ({ navigation }) => {
    const dispatch = useDispatch();
    const allArtists = useSelector(state => state.artists);

    const viewArtistProfile = id => {
        navigation.push('Profile', {
            artistId: id
        });
    }

    const viewArtistTracks = artistId => {
        alert(artistId);
    }

    const Artists = () => (
        <>
            {
                Object.keys(allArtists).map((key, index) => (
                    <View style={styles.artistContainer} key={index}>
                        <Card style={styles.card} onPress={() => viewArtistProfile(allArtists[key].userId)}>
                            <Chip style={styles.chip} icon="music-box-multiple" onPress={() => viewArtistTracks(allArtists[key].userId)}>{allArtists[key].trackAmount}</Chip>
                            <Card.Cover style={styles.cardCover} source={{ uri: allArtists[key].artistImageUrl }} />
                            <Title style={styles.cardTitle}>{allArtists[key].artistName}</Title>
                        </Card>
                    </View>
                ))
            }
        </>
    );

    return (
        <View style={styles.artistListContainer}>
            <Artists />
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