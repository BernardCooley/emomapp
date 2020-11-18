import React from 'react';
import PropTypes from 'prop-types';

import TracksAndArtists from '../components/TracksAndArtists';

const TracksScreen = ({ navigation }) => {
    return (
        <TracksAndArtists artistsOrTracks='tracks' navigation={navigation}/>
    );
}

TracksScreen.propTypes = {
    navigation: PropTypes.object,
    artistsOrTracks: PropTypes.string
}


export default TracksScreen;
