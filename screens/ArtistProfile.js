import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Text, IconButton, Title, Divider, Avatar, Subheading, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import TracksList from '../components/TracksList';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/client';

import SocialLinks from '../components/SocialLinks';
import { ARTIST_PROFILE } from '../queries/graphQlQueries';

const socialsList = [
    'facebook',
    'soundcloud',
    'mixcloud',
    'spotify',
    'instagram',
    'twitter',
    'bandcamp',
    'otherSocial'
]

const ArtistProfileScreen = ({ navigation, route }) => {
    const { artistId } = route.params;
    const { colors } = useTheme();
    const allTracks = useSelector(state => state.tracks);
    const [currentProfileTracks, setCurrentProfileTracks] = useState({});
    const [socials, setSocials] = useState({});

    const { loading, error, data: artistProfileData, refetch } = useQuery(
        ARTIST_PROFILE,
        {
            variables: {
                id: artistId
            }
        }
    );

    useEffect(() => {
        if (artistProfileData) {
            getSocials();
        }
    }, [loading]);

    const goBack = () => {
        navigation.goBack();
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

    const getSocials = () => {
        setSocials(Object.keys(artistProfileData.artists[0])
            .filter(key => socialsList.includes(key))
            .reduce((obj, key) => {
                obj[key] = artistProfileData.artists[0][key];
                return obj;
            }, {}));
    }

    return (
        <>
            {artistProfileData ?
                <SafeAreaView>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between'
                    }}>
                        <View style={styles.container}>
                            <IconButton style={styles.closeButton} animated icon="close" size={25} onPress={goBack} />
                            <Title style={StyleSheet.title}>{artistProfileData.artists[0].artistName}</Title>
                            <Divider />
                            <Avatar.Image style={styles.artistImage} size={300} source={{ uri: artistProfileData.artists[0].artistImageName }} />
                            <Divider />
                            {artistProfileData.artists[0].bio.length > 0 &&
                                <>
                                    <Subheading style={styles.subHeading}>Bio</Subheading>
                                    <Text style={styles.detailText}>{artistProfileData.artists[0].bio}</Text>
                                    <Divider />
                                </>
                            }
                            {artistProfileData.artists[0].location.length > 0 &&
                                <>
                                    <Subheading style={styles.subHeading}>Location</Subheading>
                                    <Text style={styles.detailText}>{artistProfileData.artists[0].location}</Text>
                                    <Divider />
                                </>
                            }
                            {artistProfileData.artists[0].website.length > 0 &&
                                <View style={styles.link}>
                                    <Subheading style={styles.subHeading}>Website</Subheading>
                                    <TouchableOpacity onPress={() => openUrl(artistProfileData.artists[0].website)}>
                                        <Text style={{ ...styles.detailText, ...styles.linkText, color: colors.primary }}>{artistProfileData.artists[0].website}</Text>
                                    </TouchableOpacity>
                                    <Divider />
                                </View>
                            }

                            {Object.keys(socials).length > 0 ?
                                <>
                                    <Subheading style={styles.subHeading}>Socials</Subheading>
                                    <SocialLinks socials={socials} />
                                    <Divider />
                                </>: null
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
    navigation: PropTypes.object,
    socials: PropTypes.object
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
