import screenReducers from './screenReducers';
import authReducers from './authReducers';
import musicReducers from './musicReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    currentScreen: screenReducers.currentScreen,
    user: authReducers.user,
    queueModalVisible: musicReducers.queueModalVisible,
    commentsModalVisible: musicReducers.commentsModalVisible,
    playerImageSize: musicReducers.playerImageSize,
    navigation: screenReducers.navigation,
    snackbarMessage: screenReducers.snackbarMessage,
    listenedTracks: musicReducers.listenedTracks,
    favouritedTracks: musicReducers.favouritedTracks,
    activityIndicator: screenReducers.activityIndicator,
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