import React from 'react';
import { Keyboard } from 'react-native';
import PlacesInput from '../customModules/react-native-places-input';

const GooglePlacesInput = () => {

    return (
        <PlacesInput
            stylesContainer={{
                position: 'relative',
                alignSelf: 'stretch',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 10
            }}
            stylesList={{
                top: 0
            }}
            stylesInput={{
                fontSize: 20,
                color: 'red',
                paddingBottom: 10
            }}
            googleApiKey={'AIzaSyCLP-1eAvH9SK8Q-Gf7UgLqojEoD_NBQeM'}
            onSelect={place => {
                Keyboard.dismiss();
                console.log(place);
            }}
        />
    )
};

export default GooglePlacesInput;