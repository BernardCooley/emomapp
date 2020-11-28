export const currentScreen = screenName => {
    return {
        type: 'CURRENT_SCREEN',
        payload: screenName
    };
};

export const user = user => {
    return {
        type: 'USER',
        payload: user
    };
};

export const tracks = tracks => {
    return {
        type: 'TRACKS',
        payload: tracks
    };
};

export const artists = artists => {
    return {
        type: 'ARTISTS',
        payload: artists
    };
};

export const queueModalVisible = visible => {
    return {
        type: 'QUEUE_MODAL_VISIBLE',
        payload: visible
    };
};

export const commentsModalVisible = visible => {
    return {
        type: 'COMMENTS_MODAL_VISIBLE',
        payload: visible
    };
};

export const trackComments = comments => {
    return {
        type: 'TRACK_COMMENTS',
        payload: comments
    };
};

export const commentType = commentType => {
    return {
        type: 'COMMENT_TYPE',
        payload: commentType
    };
};

export const newComment = newComment => {
    return {
        type: 'NEW_COMMENT',
        payload: newComment
    };
};

export const commentIndex = commentIndex => {
    return {
        type: 'COMMENT_INDEX',
        payload: commentIndex
    };
};

export const trackListFilters = trackListFilters => {
    return {
        type: 'TRACK_LIST_FILTERS',
        payload: trackListFilters
    };
};

export const setNavigation = navigation => {
    return {
        type: 'NAVIGATION',
        payload: navigation
    };
};

export const setSnackbarMessage = snackbarMessage => {
    return {
        type: 'SNACKBAR_MESSAGE',
        payload: snackbarMessage
    };
};

export const setListenedTracks = listenedTracks => {
    return {
        type: 'LISTENED_TRACKS',
        payload: listenedTracks
    };
};

export const setFavouritedTracks = favouritedTracks => {
    return {
        type: 'FAVOURITED_TRACKS',
        payload: favouritedTracks
    };
};

export const setActivityIndicator = activityIndicator => {
    return {
        type: 'ACTIVITY_INDICATOR',
        payload: activityIndicator
    };
};

export const setNetConnected = netConnected => {
    return {
        type: 'NET_CONNECTED',
        payload: netConnected
    };
};

export const setFilterSortMenu = filterSortMenu => {
    return {
        type: 'FILTER_SORT_MENU',
        payload: filterSortMenu
    };
};

export const setSortAndFilterOptions = sortAndFilterOptions => {
    return {
        type: 'SORT_AND_FILTER_OPTIONS',
        payload: sortAndFilterOptions
    };
};

export const setLocation = location => {
    return {
        type: 'LOCATION',
        payload: location
    };
};

export const setTrackUploadModalOpen = trackUploadModalOpen => {
    return {
        type: 'TRACK_UPLOAD_MODAL_OPEN',
        payload: trackUploadModalOpen
    };
};