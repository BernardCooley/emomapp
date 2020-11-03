import screenReducers from './screenReducers';
import authReducers from './authReducers';
import musicReducers from './musicReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    currentScreen: screenReducers.currentScreen,
    user: authReducers.user,
    tracks: musicReducers.tracks,
    artistProfileId: screenReducers.artistProfileId,
    artists: musicReducers.artists,
    queueModalVisible: musicReducers.queueModalVisible,
    commentsModalVisible: musicReducers.commentsModalVisible,
    trackComments: musicReducers.trackComments,
    commentType: musicReducers.commentType,
    newComment: musicReducers.newComment,
    commentIndex: musicReducers.commentIndex,
    trackListFilters: musicReducers.trackListFilters,
    playerImageSize: musicReducers.playerImageSize
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        state = undefined;
    }

    return allReducers(state, action);
};

export default rootReducer;