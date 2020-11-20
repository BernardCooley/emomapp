import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar, IconButton, List, Divider, Menu, useTheme } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@apollo/client';

import { setListenedTracks, setFavouritedTracks } from '../Actions/index';
import useFavAndListened from '../hooks/useFavAndListened';
import FilterSortTracks from './FilterSortTracks';
import { SELECTED_ARTISTS_ARTIST_NAME } from '../queries/graphQlQueries';


const TracksList = ({ navigation, listLocation, tracks }) => {
    const { colors } = useTheme();
    const [addFavouritedTrack, removeFavouritedTrack, favouritesError] = useFavAndListened(auth().currentUser.uid, 'favourites');
    const [addListenedTrack, removeListenedTrack, listenedError] = useFavAndListened(auth().currentUser.uid, 'listened');
    const dispatch = useDispatch();
    const playerContext = usePlayerContext();
    const [showMenu, setShowMenu] = useState(false);
    const [menuLocation, setMenuLocation] = useState({});
    const [clickedTrack, setClickedTrack] = useState('');
    const usersRef = firestore().collection('users');
    const allListenedTracks = useSelector(state => state.listenedTracks);
    const allFavouritedTracks = useSelector(state => state.favouritedTracks);
    const [artistIds, setArtistIds] = useState([]);


    const { loading, error, data, refetch } = useQuery(
        SELECTED_ARTISTS_ARTIST_NAME,
        {
            variables: {
                artistIds: artistIds
            }
        }
    );

    useEffect(() => {
        if(tracks) {
            setArtistIds(tracks.tracks.map(track => track.artistId));
        }
    }, [tracks]);

    useEffect(() => {
        const unsubscribe = usersRef.doc(auth().currentUser.uid).onSnapshot(onListenedTracksGetResult, onListenedTracksError);

        const unsubscribe2 = usersRef.doc(auth().currentUser.uid).onSnapshot(onFavouritedTracksGetResult, onFavouritedTracksError);

        return () => {
            unsubscribe();
            unsubscribe2();
        };
    }, []);

    const trackListened = trackId => {
        return allListenedTracks.includes(trackId);
    }

    const onListenedTracksGetResult = QuerySnapshot => {
        const listenedTracks = QuerySnapshot.data().listened ? QuerySnapshot.data().listened : [];
        dispatch(setListenedTracks(listenedTracks));
    }

    const onListenedTracksError = error => {
        console.error(error);
    }

    const onFavouritedTracksGetResult = QuerySnapshot => {
        const favouritedTracks = QuerySnapshot.data().favourites ? QuerySnapshot.data().favourites : [];
        dispatch(setFavouritedTracks(favouritedTracks));
    }

    const onFavouritedTracksError = error => {
        console.error(error);
    }

    const openMenu = (e, track) => {
        setClickedTrack(track);
        setMenuLocation({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        })
        setShowMenu(true);
    }

    const playTrack = async track => {
        const tr = {
            ...track,
            url: `https://storage.googleapis.com/emom-files/${track.artistId}/tracks/${track.id}/${track.id}.mp3`,
            artist: data.artists.filter(artist => artist.id === track.artistId)[0].artistName,
            trackImage: getTrackImageUrl(track.artistId, track.id, track.imageName)
        };

        playerContext.play(tr);
        navigation.push('Music');
    }

    const queueTrack = async () => {
        setShowMenu(false);

        const tr = {
            ...clickedTrack,
            url: `https://storage.googleapis.com/emom-files/${clickedTrack.artistId}/tracks/${clickedTrack.id}/${clickedTrack.id}.mp3`,
            artist: data.artists.filter(artist => artist.id === clickedTrack.artistId)[0].artistName,
            trackImage: getTrackImageUrl(clickedTrack.artistId, clickedTrack.id, clickedTrack.imageName)
        };

        playerContext.play(tr, true);
    }

    const artistProfile = () => {
        setShowMenu(false);
        navigation.push('Profile', {
            artistId: clickedTrack.artistId
        });
    }

    const closeMenu = () => {
        setShowMenu(false);
    }

    const DotsIcon = track => {
        return (
            <>
                {listLocation !== 'playerQueue' &&
                    <IconButton animated icon="dots-vertical" size={30} onPress={e => openMenu(e, track.track)} />
                }
            </>
        )
    }

    const toggleFavOrListened = favOrListened => {
        if (favOrListened === 'favourites') {
            allFavouritedTracks.filter(trackId => trackId === clickedTrack.id).length > 0 ? removeFavouritedTrack(clickedTrack.id) : addFavouritedTrack(clickedTrack.id);
        } else {
            allListenedTracks.filter(trackId => trackId === clickedTrack.id).length > 0 ? removeListenedTrack(clickedTrack.id) : addListenedTrack(clickedTrack.id);
        }
    }

    const trackFavourited = trackId => {
        return allFavouritedTracks.includes(trackId);
    }

    const getArtistName = artistId => {
        if(data) {
            return (
                <Text>
                    {data.artists.filter(artist => artist.id === artistId)[0].artistName}
                </Text>
            )
        }
    }

    const getTrackImageUrl = (artistId, trackId, imageName) => {
        const baseStorageUrl = 'https://storage.googleapis.com/emom-files/';
        return `${baseStorageUrl}${artistId}/tracks/${trackId}/${imageName}`;
    }

    const TracksList = () => (
        <>
            {
                tracks && tracks.tracks.map((track, index) => (
                    <View key={index}>
                        <List.Item
                            titleNumberOfLines={1}
                            descriptionNumberOfLines={1}
                            titleEllipsizeMode='tail'
                            descriptionEllipsizeMode='tail'
                            titleStyle={{ fontSize: 22 }}
                            descriptionStyle={{ fontSize: 15 }}
                            style={styles.listItem}
                            title={track.title}
                            description={() => getArtistName(track.artistId)}
                            left={() =>
                                <Avatar.Image style={styles.trackImage} size={40} source={{ uri: getTrackImageUrl(track.artistId, track.id, track.imageName) }} />
                            }
                            right={() =>
                                <View style={styles.trackListingRight}>
                                    <DotsIcon track={track} />
                                </View>}
                            onPress={() => playTrack(track)}
                        />
                    </View>
                ))
            }
        </>
    );

    TracksList.propTypes = {
        track: PropTypes.object
    }

    return (
        <>
            <Menu
                visible={showMenu}
                style={styles.menu}
                onDismiss={closeMenu}
                anchor={menuLocation}>
                <Menu.Item onPress={queueTrack} icon="plus-box-multiple" title="Queue track" />
                <Divider />
                <Menu.Item onPress={artistProfile} icon="account-box" title="Artist profile" />
                <Menu.Item onPress={() => toggleFavOrListened('favourites')} icon={trackFavourited(clickedTrack.id) ? 'heart' : 'heart-outline'} title={trackFavourited(clickedTrack.id) ? 'Unfavourite' : 'Favourite'} color={trackFavourited(clickedTrack.id) ? colors.dark : colors.lightGray} />
                <Menu.Item onPress={() => toggleFavOrListened('listened')} icon={trackListened(clickedTrack.id) ? 'ear-hearing' : 'ear-hearing-off'} title={trackListened(clickedTrack.id) ? 'Set to unlistened' : 'Set to listened'} color={trackListened(clickedTrack.id) ? colors.dark : colors.lightGray} />
            </Menu>
            <FilterSortTracks />
            <TracksList />
        </>
    );
}

const styles = StyleSheet.create({
    menu: {
        width: 220
    },
    listItem: {
        height: 60,
        paddingVertical: 0,
        paddingHorizontal: 10
    },
    trackImage: {
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    trackListingRight: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        right: -15
    }
});

export default TracksList;
