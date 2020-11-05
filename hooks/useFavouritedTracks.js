import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


const useFacouritedTracks = (userId) => {
    const allFavouritedTracks = useSelector(state => state.favouritedTracks);
    const usersRef = firestore().collection('users');
    const [favouritesError, setFavouritesError] = useState(null);


    const addFavouritedTrack = async trackId => {
        try {
            if(trackId.length > 0) {
                    let alreadyFavourited = [...allFavouritedTracks];
        
                    if (!alreadyFavourited.includes(trackId)) {
                        alreadyFavourited = [...alreadyFavourited, trackId];
                    }
        
                    await usersRef.doc(userId).update({
                        favourites: alreadyFavourited,
                    });
            }
        } catch (error) {
            setFavouritesError(error);
        }
    };

    const removeFavouritedTrack = async trackId => {
        try {
            if(trackId.length > 0) {
                const alreadyFavourited = [...allFavouritedTracks.filter(id => id !== trackId)];

                await usersRef.doc(userId).update({
                    favourites: alreadyFavourited,
                });
            }
        } catch (error) {
            setFavouritesError(error);
        }
    };


    return [addFavouritedTrack, removeFavouritedTrack, favouritesError];
}

export default useFacouritedTracks;