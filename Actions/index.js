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

export const artistProfileId = id => {
    return {
        type: 'ARTIST_PROFILE_ID',
        payload: id
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