import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, List, Divider, Menu, useTheme } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import storage from '@react-native-firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { setListenedTracks, setSnackbarMessage, setFavouritedTracks } from '../Actions/index';
import useFavAndListened from '../hooks/useFavAndListened';


const TracksList = ({ navigation, tracks, listLocation }) => {
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

    useEffect(() => {
        const unsibscribe = usersRef.doc(auth().currentUser.uid).onSnapshot(onListenedTracksGetResult, onListenedTracksError);

        const unsibscribe2 = usersRef.doc(auth().currentUser.uid).onSnapshot(onFavouritedTracksGetResult, onFavouritedTracksError);

        return () => {
            unsibscribe();
            unsibscribe2();
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
        await storage().ref(`tracks/${track.id}.mp3`).getDownloadURL().then(url => {
            track['url'] = url;
            playerContext.play(track);
            navigation.push('Music');
        });
    }

    const queueTrack = async () => {
        setShowMenu(false);
        await storage().ref(`tracks/${clickedTrack.id}.mp3`).getDownloadURL().then(url => {
            clickedTrack['url'] = url;
            playerContext.play(clickedTrack, true);
        });
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

    const toggleListened = () => {
        if (allListenedTracks.filter(trackId => trackId === clickedTrack.id).length > 0) {
            removeListenedTrack(clickedTrack.id);
            dispatch(setSnackbarMessage(`Set to unlistened`));
        }else {
            addListenedTrack(clickedTrack.id);
            dispatch(setSnackbarMessage(`Set to listened`));
        }
    }

    const trackFavourited = trackId => {
        return allFavouritedTracks.includes(trackId);
    }

    const toggleFavourited = () => {
        if (allFavouritedTracks.filter(trackId => trackId === clickedTrack.id).length > 0) {
            removeFavouritedTrack(clickedTrack.id);
        } else {
            addFavouritedTrack(clickedTrack.id);
        }
    }

    const TracksList = () => (
        <>
            {
                Object.keys(tracks).map((key, index) => (
                    <View key={index}>
                        <List.Item
                            titleNumberOfLines={1}
                            descriptionNumberOfLines={1}
                            titleEllipsizeMode='tail'
                            descriptionEllipsizeMode='tail'
                            titleStyle={{ fontSize: 15 }}
                            descriptionStyle={{ fontSize: 22 }}
                            style={styles.listItem}
                            title={tracks[key].artist}
                            description={tracks[key].title}
                            left={() =>
                                <Avatar.Image style={styles.trackImage} size={40} source={{ uri: tracks[key].trackImage }} />
                            }
                            right={() => 
                            <View style={styles.trackListingRight}>
                                <DotsIcon track={tracks[key]} />
                            </View>}
                            onPress={() => playTrack(tracks[key])}
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
                <Menu.Item onPress={toggleFavourited} icon={trackFavourited(clickedTrack.id) ? 'heart' : 'heart-outline'} title={trackFavourited(clickedTrack.id) ? 'Unfavourite' : 'Favourite'} color={trackFavourited(clickedTrack.id) ? colors.dark : colors.lightGray} />
                <Menu.Item onPress={toggleListened} icon={trackListened(clickedTrack.id) ? 'ear-hearing' : 'ear-hearing-off'} title={trackListened(clickedTrack.id) ? 'Set to unlistened' : 'Set to listened'} color={trackListened(clickedTrack.id) ? colors.dark : colors.lightGray} />
            </Menu>
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
