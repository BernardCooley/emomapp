import React from 'react';
import PropTypes from 'prop-types';

import TracksAndArtists from '../components/TracksAndArtists';

const ArtistsScreen = ({ navigation }) => {
    return (
        <TracksAndArtists artistsOrTracks='artists' navigation={navigation}/>
    );
}

ArtistsScreen.propTypes = {
    navigation: PropTypes.object,
    artistsOrTracks: PropTypes.string
}

export default ArtistsScreen;
