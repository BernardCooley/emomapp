import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, List, Divider, Menu } from 'react-native-paper';
import { usePlayerContext } from '../contexts/PlayerContext';
import storage from '@react-native-firebase/storage';
import { useDispatch } from 'react-redux';
import { artistProfileId } from '../Actions/index';
import PropTypes from 'prop-types';


const TracksList = ({ navigation, tracks, listLocation }) => {
    const dispatch = useDispatch();
    const playerContext = usePlayerContext();
    const [showMenu, setShowMenu] = useState(false);
    const [menuLocation, setMenuLocation] = useState({});
    const [clickedTrack, setClickedTrack] = useState('');

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
            navigation.navigate('Tabs', { screen: 'Music' });
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
        dispatch(artistProfileId(clickedTrack.artistId));
        navigation.navigate('Profile');
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
                                <Avatar.Image style={styles.trackImage} size={50} source={{ uri: tracks[key].trackImage }} />
                            }
                            right={() => <DotsIcon track={tracks[key]}/>}
                            onPress={() => playTrack(tracks[key])}
                        />
                        <Divider />
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
                onDismiss={closeMenu}
                anchor={menuLocation}>
                <Menu.Item onPress={() => queueTrack()} icon="plus-box-multiple" title="Queue track" />
                <Divider />
                <Menu.Item onPress={() => artistProfile()} icon="account-box" title="Artist profile" />
            </Menu>
            <TracksList />
        </>
    );
}

const styles = StyleSheet.create({
    listItem: {
        height: 60,
        paddingVertical: 0,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    trackImage: {
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
});

export default TracksList;
