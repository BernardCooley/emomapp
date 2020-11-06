const reducers = {
    netConnected: (state = true, action) => {
        switch (action.type) {
            case 'NET_CONNECTED':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default reducers;