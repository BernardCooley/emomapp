import screenReducers from './screenReducers';
import musicReducers from './musicReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    queueModalVisible: musicReducers.queueModalVisible,
    commentsModalVisible: musicReducers.commentsModalVisible,
    playerImageSize: musicReducers.playerImageSize,
    navigation: screenReducers.navigation,
    listenedTracks: musicReducers.listenedTracks,
    favouritedTracks: musicReducers.favouritedTracks,
    filterSortMenu: screenReducers.filterSortMenu,
    sortAndFilterOptions: musicReducers.sortAndFilterOptions,
    location: screenReducers.location
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        state = undefined;
    }

    return allReducers(state, action);
};

export default rootReducer;