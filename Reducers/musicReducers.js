const musicReducers = {
    queueModalVisible: (state = false, action) => {
        switch (action.type) {
            case 'QUEUE_MODAL_VISIBLE':
                return state = action.payload;
            default:
                return state;
        }
    },
    commentsModalVisible: (state = false, action) => {
        switch (action.type) {
            case 'COMMENTS_MODAL_VISIBLE':
                return state = action.payload;
            default:
                return state;
        }
    },
    playerImageSize: (state = 300, action) => {
        switch (action.type) {
            case 'PLAYER_IMAGE_SIZE':
                return state = action.payload;
            default:
                return state;
        }
    },
    listenedTracks: (state = [], action) => {
        switch (action.type) {
            case 'LISTENED_TRACKS':
                return state = action.payload;
            default:
                return state;
        }
    },
    favouritedTracks: (state = [], action) => {
        switch (action.type) {
            case 'FAVOURITED_TRACKS':
                return state = action.payload;
            default:
                return state;
        }
    },
    sortAndFilterOptions: (state = {
        tracks: {
            sort: '',
            filter: ''
        },
        artists: {
            sort: '',
            filter: ''
        }
    }, action) => {
        switch (action.type) {
            case 'SORT_AND_FILTER_OPTIONS':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default musicReducers;