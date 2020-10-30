import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const socialIconColours = {
    facebook: '#4267B2',
    instagram: '#E1306C',
    twitter: '#1DA1F2',
    soundcloud: '#ff8800',
    bandcamp: '#629aa9',
    spotify: '#1DB954'
}


const SocialLinks = ({ socials }) => {

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
            <View style={styles.socialLinks}>
                {
                    Object.keys(socials).map((key, index) => (
                        <View key={index}>
                            {socials[key].url.length > 0 &&
                                <TouchableOpacity onPress={() => openUrl(socials[key].url)}>
                                    <IconButton color={socialIconColours[socials[key].name]} animated icon={socials[key].name} size={30} />
                                </TouchableOpacity>
                            }
                        </View>
                    ))
                }
            </View>
        </>
    );
}

SocialLinks.propTypes = {
    socials: PropTypes.array
}

const styles = StyleSheet.create({
    socialLinks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    }
});

export default SocialLinks;
