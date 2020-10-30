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
    }
}

export default screenReducers;