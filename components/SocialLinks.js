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
                        <View style={styles.socialLinks} key={index}>
                            {socials[key].length > 0 &&
                                <TouchableOpacity onPress={() => openUrl(socials[key])}>

                                    {key === 'mixcloud' || key === 'otherSocial' ? 
                                        <>
                                        {key === 'mixcloud' &&
                                        // TODO image not showing
                                            <IconButton color={socialIconColours[key]} animated icon={require('../assets/icons/mixcloud_logo.svg')} size={30} />
                                        }
                                        {key === 'otherSocial' &&
                                            <></>
                                        }
                                        </> :
                                        <IconButton color={socialIconColours[key]} animated icon={key} size={30} />
                                    }
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
        justifyContent: 'flex-start',
        width: '100%'
    }
});

export default SocialLinks;
