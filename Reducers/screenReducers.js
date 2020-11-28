const screenReducers = {
    currentScreen: (state = '', action) => {
        switch (action.type) {
            case 'CURRENT_SCREEN':
                return state = action.payload;
            default:
                return state;
        }
    },
    navigation: (state = {}, action) => {
        switch (action.type) {
            case 'NAVIGATION':
                return state = action.payload;
            default:
                return state;
        }
    },
    snackbarMessage: (state = '', action) => {
        switch (action.type) {
            case 'SNACKBAR_MESSAGE':
                return state = action.payload;
            default:
                return state;
        }
    },
    activityIndicator: (state = false, action) => {
        switch (action.type) {
            case 'ACTIVITY_INDICATOR':
                return state = action.payload;
            default:
                return state;
        }
    },
    filterSortMenu: (state = '', action) => {
        switch (action.type) {
            case 'FILTER_SORT_MENU':
                return state = action.payload;
            default:
                return state;
        }
    }
    ,
    trackUploadModalOpen: (state = false, action) => {
        switch (action.type) {
            case 'TRACK_UPLOAD_MODAL_OPEN':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default screenReducers;