import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { tracks, artists, setActivityIndicator, setNetConnected } from '../Actions/index';
import NetInfo from '@react-native-community/netinfo';

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

        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected) {
                setNetConnected(true);
            }else {
                setNetConnected(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const getData = async () => {
        dispatch(setActivityIndicator(true));
        try {
            await collectionRef.orderBy(orderBy).limit(limit).get().then(
                response => {
                    const data = [...response.docs.map(doc => doc.data())];

                    if (collectionName === 'tracks') {
                        setTracksState(data);
                        getTrackImages(data);
                    } else if (collectionName === 'users') {
                        data.forEach((artist, index) => {
                            if (allTracks.length > 0) {
                                data[index]['trackAmount'] = allTracks.filter(track => track.artistId === artist.userId).length;
                            } else {
                                data[index]['trackAmount'] = 0;
                            }
                        });
                        dispatch(setActivityIndicator(false));
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

    const getTrackImages = async trackData => {
        const queryList = [];

        trackData.forEach(track => {
            queryList.push(
                {
                    query: storage().ref(`trackImages/${track.id}.jpg`).getDownloadURL(),
                    track: track
                }
            );
        });

        const updatedTracks = await Promise.all(
            queryList.map(async query => {
                query.track['trackImage'] = await query.query;
                return query.track;
            })
        );

        dispatch(tracks(updatedTracks));
        dispatch(setActivityIndicator(false));
    }

    const getNextItems = async () => {
        dispatch(setActivityIndicator(true));
        if (tracksState.length > 0 || artistsState.length > 0) {
            try {
                await collectionRef.orderBy(orderBy).startAfter(lastItem).limit(limit).get().then(
                    response => {
                        const data = response.docs.map(doc => doc.data());
                        let concatData = []
                        if (collectionName === 'tracks') {
                            concatData = [...tracksState, ...data];
                            setTracksState(concatData);
                            getTrackImages(concatData);
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
                            dispatch(setActivityIndicator(false));
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

    return [getData, error, getNextItems, getTrackImages];
}

export default useFirebaseCall;