import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Text, IconButton, Title, Divider, Avatar, Subheading, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { artistProfileId } from '../Actions/index';
import TracksList from '../components/TracksList';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';

import SocialLinks from '../components/SocialLinks';

const ArtistProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const currentprofileId = useSelector(state => state.artistProfileId);
    const allTracks = useSelector(state => state.tracks);
    const [currentProfile, setCurrentProfile] = useState({});
    const [currentProfileTracks, setCurrentProfileTracks] = useState({});

    useEffect(() => {
        if (currentprofileId.length > 0) {
            firestore().collection('users').doc(currentprofileId).get().then(response => {
                setCurrentProfile(response.data());
            })
        }
    }, [currentprofileId]);

    useEffect(() => {
        if (currentProfile) {
            setCurrentProfileTracks(allTracks.filter(track => track.artistId === currentProfile.userId));
        }
    }, [currentProfile]);

    const backToArtists = () => {
        navigation.navigate('Tabs', { screen: 'Artists' });
        dispatch(artistProfileId(''));
    }

    const openUrl = url => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                alert("Can't open: " + url);
            }
        });
    }

    return (
        <>
            {currentProfile ?
                <SafeAreaView>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between'
                    }}>
                        <View style={styles.container}>
                            <IconButton style={styles.closeButton} animated icon="close" size={25} onPress={backToArtists} />
                            <Title style={StyleSheet.title}>{currentProfile.artistName}</Title>
                            <Divider />
                            <Avatar.Image style={styles.artistImage} size={300} source={{ uri: currentProfile.artistImageUrl }} />
                            <Divider />
                            {currentProfile.bio && currentProfile.bio.length > 0 ?
                                <>
                                    <Subheading style={styles.subHeading}>Bio</Subheading>
                                    <Text style={styles.detailText}>{currentProfile.bio}</Text>
                                    <Divider />
                                </> : null
                            }
                            {currentProfile.location && currentProfile.location.length > 0 ?
                                <>
                                    <Subheading style={styles.subHeading}>Location</Subheading>
                                    <Text style={styles.detailText}>{currentProfile.location}</Text>
                                    <Divider />
                                </> : null
                            }
                            {currentProfile.website && currentProfile.website.length > 0 ?
                                <View style={styles.link}>
                                    <Subheading style={styles.subHeading}>Website</Subheading>
                                    <TouchableOpacity onPress={() => openUrl(currentProfile.website)}>
                                        <Text style={{...styles.detailText, ...styles.linkText, color: colors.primary}}>{currentProfile.website}</Text>
                                    </TouchableOpacity>
                                    <Divider />
                                </View> : null
                            }
                            {currentProfile.socials && Object.keys(currentProfile.socials).length > 0 ?
                                <>
                                    <Subheading style={styles.subHeading}>Socials</Subheading>
                                    <SocialLinks socials={currentProfile.socials} />
                                    <Divider />
                                </> : null
                            }
                        </View>
                        <View>
                            <Subheading style={styles.tracksDetail}>Tracks</Subheading>
                            {currentProfileTracks.length > 0 ?
                                <TracksList tracks={currentProfileTracks} navigation={navigation} /> :
                                <Text style={styles.tracksDetail}>None</Text>
                            }
                        </View>
                    </ScrollView>

                </SafeAreaView> :
                <View>
                    <Text>No profile. Redirect back to tracks and alert</Text>
                </View>
            }
        </>
    );
}

ArtistProfileScreen.propTypes = {
    tracks: PropTypes.object,
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 10,
        padding: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    title: {
        textAlign: 'center',
        width: '100%',
        borderWidth: 1,
        fontSize: 50
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    artistImage: {
        marginVertical: 30
    },
    subHeading: {
        width: '100%'
    },
    tracksDetail: {
        paddingTop: 20,
        paddingHorizontal: 20
    },
    detailText: {
        width: '100%',
        marginBottom: 15
    },
    link: {
        width: '100%'
    },
    linkText: {
        textDecorationLine: 'underline'
    }
});

export default ArtistProfileScreen;
