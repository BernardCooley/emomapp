const screenReducers = {
    navigation: (state = {}, action) => {
        switch (action.type) {
            case 'NAVIGATION':
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
    },
    location: (state = '', action) => {
        switch (action.type) {
            case 'LOCATION':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default screenReducers;