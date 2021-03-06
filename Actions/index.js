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

export const setNavigation = navigation => {
    return {
        type: 'NAVIGATION',
        payload: navigation
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