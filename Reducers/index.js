import screenReducers from './screenReducers';
import authReducers from './authReducers';
import musicReducers from './musicReducers';
import { combineReducers } from 'redux';
import reducers from './reducers';

const allReducers = combineReducers({
    currentScreen: screenReducers.currentScreen,
    user: authReducers.user,
    tracks: musicReducers.tracks,
    artists: musicReducers.artists,
    queueModalVisible: musicReducers.queueModalVisible,
    commentsModalVisible: musicReducers.commentsModalVisible,
    trackComments: musicReducers.trackComments,
    commentType: musicReducers.commentType,
    newComment: musicReducers.newComment,
    commentIndex: musicReducers.commentIndex,
    trackListFilters: musicReducers.trackListFilters,
    playerImageSize: musicReducers.playerImageSize,
    navigation: screenReducers.navigation,
    snackbarMessage: screenReducers.snackbarMessage,
    listenedTracks: musicReducers.listenedTracks,
    favouritedTracks: musicReducers.favouritedTracks,
    activityIndicator: screenReducers.activityIndicator,
    netConnected: reducers.netConnected,
    filterSortMenu: screenReducers.filterSortMenu,
    sortAndFilterOptions: musicReducers.sortAndFilterOptions
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        state = undefined;
    }

    return allReducers(state, action);
};

export default rootReducer;