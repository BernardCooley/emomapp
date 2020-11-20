import React from 'react';
import PropTypes from 'prop-types';

import TracksAndArtists from '../components/TracksAndArtists';

const ArtistsScreen = ({ navigation }) => {
    return (
        <TracksAndArtists listType='artists' navigation={navigation}/>
    );
}

ArtistsScreen.propTypes = {
    navigation: PropTypes.object,
    listType: PropTypes.string
}

export default ArtistsScreen;
