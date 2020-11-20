import React from 'react';
import PropTypes from 'prop-types';

import TracksAndArtists from '../components/TracksAndArtists';

const TracksScreen = ({ navigation }) => {
    return (
        <TracksAndArtists listType='tracks' navigation={navigation}/>
    );
}

TracksScreen.propTypes = {
    navigation: PropTypes.object,
    listType: PropTypes.string
}


export default TracksScreen;
