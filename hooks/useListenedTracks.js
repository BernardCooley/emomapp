import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';


const useListenedTracks = (userId) => {
    const allListenedTracks = useSelector(state => state.listenedTracks);
    const dispatch = useDispatch();
    const usersRef = firestore().collection('users');
    const [error, setError] = useState(null);


    const addListenedTrack = async (trackId) => {
        try {
            if(trackId.length > 0) {
                    let alreadyListened = [...allListenedTracks];
        
                    if (!alreadyListened.includes(trackId)) {
                        alreadyListened = [...alreadyListened, trackId];
                    }
        
                    await usersRef.doc(userId).update({
                        listened: alreadyListened,
                    }).then(() => dispatch(setListenedTracks(alreadyListened)));
            }
        } catch (error) {
            setError(error);
        }
    };

    const removeListenedTrack = async (trackId) => {
        try {
            if(trackId.length > 0) {
                    const alreadyListened = [...allListenedTracks.filter(id => id !== trackId)];

                    await usersRef.doc(userId).update({
                        listened: alreadyListened,
                    }).then(() => dispatch(setListenedTracks(alreadyListened)));
            }
        } catch (error) {
            setError(error);
        }
    };


    return [addListenedTrack, removeListenedTrack, error];
}

export default useListenedTracks;