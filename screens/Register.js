import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, LogBox } from 'react-native';
import { TextInput, Button, Text, Avatar, IconButton, ActivityIndicator, Switch, useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Box } from 'react-native-design-utility';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';

import formStyles from '../styles/FormStyles';
import { setSnackbarMessage } from '../Actions/index';
import { ADD_ARTIST } from '../queries/graphQlQueries';
import GooglePlacesInput from '../components/GooglePlacesInput';
import useUploadImage from '../hooks/useUploadImage';
import useImagePicker from '../hooks/useImagePicker';


const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    LogBox.ignoreLogs([
        'VirtualizedLists should never be nested' // TODO: Remove when fixed
    ]);

    const [artist, setArtistName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [showSocials, setShowSocials] = useState(false);
    const [newArtist, setNewArtist] = useState({});
    const { colors } = useTheme();
    const location = useSelector(state => state.location);
    const [formattedLocation, setFormattedLocation] = useState('');
    const [url, addImage, imageError] = useUploadImage();
    const [artistImage, lauchFileUploader, removeImage] = useImagePicker();

    const [
        addArtist,
        {
            loading: artistLoading,
            error: artistError,
            data: artistData
        }
    ] = useMutation(ADD_ARTIST);

    const [socials, setSocials] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        soundcloud: '',
        bandcamp: '',
        spotify: '',
        mixcloud: '',
        otherSocial: ''
    });

    useEffect(() => {
        if(location) {
            let split = location.formatted_address.split(', ');
            split = split[split.length - 1];
            const loc = `${location.name}, ${split}`
            setFormattedLocation(loc);
        }
    }, [location]);

    const [formIsValid, setFormIsValid] = useState(false);

    const errors = {
        artist: {
            valid: false
        },
        email: {
            valid: false
        },
        password: {
            valid: false
        }
    };

    useEffect(() => {
        validate();
    }, [artist, email, password, artistImage, bio]);

    useEffect(() => {
        if (artistData) {
            addImage(newArtist.user.uid, artistImage);
            setIsRegistering(false);
            navigation.push('EmailVerification',
                {
                    email: email,
                    password: password
                })
        } else if (artistError) {
            console.log(artistError);
            alert('Something went wrong. Please try again.');
            newArtist.user.delete();
        }
    }, [artistLoading]);

    const showHideSocials = () => setShowSocials(!showSocials);

    const validate = () => {
        errors.artist.valid = artist.length > 0;
        errors.email.valid = /\S+@\S+\.\S+/.test(email);
        errors.password.valid = password.length >= 6;

        errors.artist.valid && errors.email.valid && errors.password.valid ? setFormIsValid(true) : setFormIsValid(false);
    }

    const createArtist = artistId => {
        addArtist({
            variables: {
                artistName: artist,
                bio: bio,
                location: formattedLocation,
                website: website,
                artistImageName: `artist_image-${artistId}.jpg`,
                facebook: socials['facebook'],
                soundcloud: socials['soundcloud'],
                mixcloud: socials['mixcloud'],
                spotify: socials['spotify'],
                instagram: socials['instagram'],
                twitter: socials['twitter'],
                bandcamp: socials['bandcamp'],
                otherSocial: socials['otherSocial'],
                _id: artistId
            }
        });
    }

    const register = async () => {
        setIsRegistering(true);
        auth().createUserWithEmailAndPassword(email, password).then(async newArtistData => {
            setNewArtist(newArtistData);
            await newArtistData.user.sendEmailVerification().then(() => {
                createArtist(newArtistData.user.uid);
            }).catch(error => {
                console.log('DELETE USER =============>', error)
                newArtistData.user.delete();
            })
        }).catch(error => {
            setIsRegistering(false);
            console.log('REGISTER USER =============>', error);
            if (error.code === 'auth/email-already-in-use') {
                dispatch(setSnackbarMessage('Email address already in use!'));
            }
        });
    }

    return (
        <>
            {isRegistering ?
                <Box f={1} center>
                    <ActivityIndicator size='large' />
                </Box> :
                <>
                    <SafeAreaView>
                        <ScrollView
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}>
                            <View style={styles.container}>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        style={styles.input}
                                        label="Artist name"
                                        value={artist}
                                        onChangeText={artist => setArtistName(artist)}
                                    />

                                    <TextInput
                                        style={styles.input}
                                        label="Email"
                                        value={email}
                                        onChangeText={email => setEmail(email)}
                                    />

                                    <TextInput
                                        style={styles.input}
                                        label="Password"
                                        value={password}
                                        onChangeText={password => setPassword(password)}
                                        secureTextEntry={true}
                                    />

                                    <TextInput
                                        style={styles.input}
                                        label="Bio (optional)"
                                        value={bio}
                                        onChangeText={bio => setBio(bio)}
                                        multiline
                                    />

                                    <Text style={{ ...styles.artistImageLabel, ...styles.customLabel }}>Artist image (optional)</Text>
                                    {artistImage.uri ?
                                        <View style={styles.artistImageContainer}>
                                            <Avatar.Image style={styles.artistImage} size={300} source={{ uri: artistImage.uri }} />
                                            <Text onPress={removeImage} style={styles.deleteImageButton}>delete</Text>
                                        </View> :
                                        <IconButton style={styles.uploadButton} animated icon="camera" size={30} onPress={lauchFileUploader} />
                                    }

                                    <GooglePlacesInput />

                                    <View style={styles.switchContainer}>
                                        <Text style={styles.customLabel}>Socials (optional)</Text>
                                        <Switch color={colors.primary} value={showSocials} onValueChange={showHideSocials} />
                                    </View>
                                    {showSocials &&
                                        <View style={styles.socialFieldList}>
                                            {
                                                Object.keys(socials).map((key, index) => (
                                                    <TextInput
                                                        key={index}
                                                        style={{ ...styles.socialInput, ...styles.input }}
                                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                        value={socials[key]}
                                                        onChangeText={val => setSocials(socials => ({ ...socials, [key]: val }))}
                                                    />
                                                ))
                                            }
                                        </View>
                                    }

                                    <TextInput
                                        style={styles.input}
                                        label="Website (optional)"
                                        value={website}
                                        onChangeText={website => setWebsite(website)}
                                    />

                                    <Button disabled={!formIsValid} style={styles.button} mode="contained" onPress={register}>
                                        Register
                                    </Button>
                                </View>
                                <View style={styles.registerLinkContainer}>
                                    <Text style={styles.registerText}>Already registered?.....</Text>
                                    <Button style={styles.registerLink} mode="text" onPress={() => navigation.navigate('Login')}>
                                        log in
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </>
            }
        </>
    );
}

const styles = StyleSheet.create({
    ...formStyles,
    artistImageContainer: {
        flex: 1,
        alignItems: 'center'
    },
    artistImage: {
        margin: 'auto'
    },
    uploadButton: {
        marginLeft: 15
    },
    artistImageLabel: {
        paddingVertical: 25
    },
    customLabel: {
        fontSize: 20,
        color: 'gray',
        paddingLeft: 25,
    },
    deleteImageButton: {
        color: 'red',
        marginTop: 10,
        fontSize: 15
    },
    switchContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30
    },
    socialFieldList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%'
    },
    socialInput: {
        width: '95%',
        marginVertical: 5
    }
});

export default RegisterScreen;
