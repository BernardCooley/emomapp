import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, List, Divider, Menu, useTheme } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import PropTypes from 'prop-types';

import FilterSortTracks from './FilterSortTracks';


const TracksList = ({ navigation, listLocation, tracks, artistName }) => {
    const { colors } = useTheme();
    const playerContext = usePlayerContext();
    const [showMenu, setShowMenu] = useState(false);
    const [menuLocation, setMenuLocation] = useState({});
    const [clickedTrack, setClickedTrack] = useState('');
    

    useEffect(() => {
        
    }, []);

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
            artist: track.artist.artistName,
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
            artist: clickedTrack.artist.artistName,
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
        console.log(favOrListened);
    }

    const trackListened = trackId => {
        return true;
    }

    const trackFavourited = trackId => {
        return true;
    }

    const getTrackImageUrl = (artistId, trackId, imageName) => {
        const baseStorageUrl = 'https://storage.googleapis.com/emom-files/';
        return `${baseStorageUrl}${artistId}/tracks/${trackId}/${imageName}`;
    }

    const TracksList = () => (
        <>
            {
                tracks && tracks.map((track, index) => (
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
                            description={track.artist ? track.artist.artistName : artistName}
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
