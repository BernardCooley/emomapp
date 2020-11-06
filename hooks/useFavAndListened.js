import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const useFavAndListened = (userId, favOrListened) => {
    const allData = favOrListened === 'favourites' ? useSelector(state => state.favouritedTracks) : useSelector(state => state.listenedTracks);

    const usersRef = firestore().collection('users');
    const [dataError, setDataError] = useState(null);

    const addTrackToFavOrListened = async trackId => {
        try {
            if(trackId.length > 0) {
                    let already = [...allData];

                    if (!already.includes(trackId)) {
                        already = [...already, trackId];
                    }

                    updateDB(already);
            }
        } catch (error) {
            setDataError(error);
        }
    };

    const removeTrackFromFavOrListened = async trackId => {
        try {
            if(trackId.length > 0) {
                const already = [...allData.filter(id => id !== trackId)];

                updateDB(already);
            }
        } catch (error) {
            setDataError(error);
        }
    };

    const updateDB = async already => {
        if(favOrListened === 'favourites') {
            await usersRef.doc(userId).update({
                favourites: already
            });
        }else {
            await usersRef.doc(userId).update({
                listened: already
            });
        }
    }

    return [addTrackToFavOrListened, removeTrackFromFavOrListened, dataError];
}

export default useFavAndListened;