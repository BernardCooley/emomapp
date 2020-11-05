import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


const useListenedTracks = (userId) => {
    const allListenedTracks = useSelector(state => state.listenedTracks);
    const usersRef = firestore().collection('users');
    const [listenedError, setListenedError] = useState(null);


    const addListenedTrack = async trackId => {
        try {
            if(trackId.length > 0) {
                    let alreadyListened = [...allListenedTracks];
        
                    if (!alreadyListened.includes(trackId)) {
                        alreadyListened = [...alreadyListened, trackId];
                    }
        
                    await usersRef.doc(userId).update({
                        listened: alreadyListened,
                    });
            }
        } catch (error) {
            setListenedError(error);
        }
    };

    const removeListenedTrack = async trackId => {
        try {
            if(trackId.length > 0) {
                const alreadyListened = [...allListenedTracks.filter(id => id !== trackId)];

                await usersRef.doc(userId).update({
                    listened: alreadyListened,
                });
            }
        } catch (error) {
            setListenedError(error);
        }
    };


    return [addListenedTrack, removeListenedTrack, listenedError];
}

export default useListenedTracks;