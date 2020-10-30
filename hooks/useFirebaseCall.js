import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { tracks, artists } from '../Actions/index';

const useFirebaseCall = (collectionName, orderBy, limit) => {
    const dispatch = useDispatch();
    const collectionRef = firestore().collection(collectionName);
    const [error, setError] = useState(null);
    const [lastItem, setLastItem] = useState(null);
    const [tracksState, setTracksState] = useState([]);
    const [artistsState, setArtistsState] = useState([]);
    const allTracks = useSelector(state => state.tracks);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getTrackImages();
    }, [tracksState]);

    const getData = async () => {
        try {
            await collectionRef.orderBy(orderBy).limit(limit).get().then(
                response => {
                    const data = response.docs.map(doc => doc.data());

                    if(collectionName === 'tracks') {
                        setTracksState(data);
                    }else if(collectionName === 'users') {
                        data.forEach((artist, index) => {
                            if (allTracks.length > 0) {
                                data[index]['trackAmount'] = allTracks.filter(track => track.artistId === artist.userId).length;
                            } else {
                                data[index]['trackAmount'] = 0;
                            }
                        })
                        setArtistsState(data);
                        dispatch(artists(data));
                    }
                    setLastItem(data[data.length - 1][orderBy]);
                }
            );
        } catch (error) {
            setError(error);
        }
    };

    const getTrackImages = () => {
        const tr = [];

        tracksState.map(async (track, index) => {
            await storage().ref(`trackImages/${track.id}.jpg`).getDownloadURL().then(url => {
                track['trackImage'] = url;
                tr.push(track);
            }).catch(error => {
                console.log('GET TRACK IMAGE =========>', error)
            })
            if (index === tracksState.length - 1) {
                dispatch(tracks(tr));
            }
        })
    }

    const getNextItems = async () => {
        if (tracksState.length > 0 || artistsState.length > 0) {
            try {
                await collectionRef.orderBy(orderBy).startAfter(lastItem).limit(limit).get().then(
                    response => {
                        const data = response.docs.map(doc => doc.data());
                        let concatData = []
                        if (collectionName === 'tracks') {
                            concatData = [...tracksState, ...data];
                            setTracksState(concatData);
                        } else if (collectionName === 'users') {
                            data.forEach((artist, index) => {
                                if (allTracks.length > 0) {
                                    data[index]['trackAmount'] = allTracks.filter(track => track.artistId === artist.userId).length;
                                } else {
                                    data[index]['trackAmount'] = 0;
                                }
                            })
                            concatData = [...artistsState, ...data];
                            setArtistsState(concatData);
                            dispatch(artists(concatData));
                        }
                        setLastItem(concatData[concatData.length - 1][orderBy]);
                    }
                );
            } catch (error) {
                console.log(error)
                setError(error);
            }
        }
    };

    return [getData, error, getNextItems];
}

export default useFirebaseCall;