import React from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
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

    const socialIcon = platform => {
        if (platform === 'mixcloud') {
            return <Image style={styles.socialIcon} source={require('../assets/icons/mixcloud_icon.png')}/>
        }
        else if (platform === 'otherSocial') {
            return <IconButton color={socialIconColours[platform]} animated icon='account-network' size={30} />
        }
        return <IconButton color={socialIconColours[platform]} animated icon={platform} size={30} />
    }

    return (
        <>
            <View style={styles.socialLinks}>
                {
                    Object.keys(socials).map((key, index) => (
                        <View style={styles.socialLinks} key={index}>
                            {socials[key].length > 0 &&
                                <TouchableOpacity onPress={() => openUrl(socials[key])}>
                                    <View>{socialIcon(key)}</View>
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
    socials: PropTypes.object
}

const styles = StyleSheet.create({
    socialLinks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
    },
    socialIcon: {
        height: 30,
        width : 30
    }
});

export default SocialLinks;
