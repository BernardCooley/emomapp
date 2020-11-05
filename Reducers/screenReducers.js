const screenReducers = {
    currentScreen: (state = '', action) => {
        switch (action.type) {
            case 'CURRENT_SCREEN':
                return state = action.payload;
            default:
                return state;
        }
    },
    artistProfileId: (state = '', action) => {
        switch (action.type) {
            case 'ARTIST_PROFILE_ID':
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
    }
}

export default screenReducers;