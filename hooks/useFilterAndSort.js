import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import { setFilterSortMenu, tracks, setActivityIndicator, setSortAndFilterOptions, artists } from '../Actions/index';

const useFilterAndSort = (listToFilter) => {
    let tracksRef = firestore().collection('tracks');
    let usersRef = firestore().collection('users');
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const [error, setError] = useState(null);
    const [disableApplyButton, setDisableApplyButton] = useState(true);
    const screenWidth = Dimensions.get("window").width;
    const menuWidth = 280;

    const sortAndFilterOptions = useSelector(state => state.sortAndFilterOptions);

    useEffect(() => {
        toggleApplyButton();
    }, [sortAndFilterOptions])

    const isSelected = (sortOrFilter, type) => {
        if (sortOrFilter === 'sort') {
            return sortAndFilterOptions[listToFilter].sort === type;
        } else {
            return sortAndFilterOptions[listToFilter].filter === type;
        }
    }

    const backgroundColor = (sortOrFilter, type) => {
        const style = {
            backgroundColor: ''
        }

        if (isSelected(sortOrFilter, type)) {
            style.backgroundColor = colors.lightGray
        } else {
            style.backgroundColor = 'transparent'
        }

        return style
    }

    const clear = () => {
        dispatch(setSortAndFilterOptions({
            ...sortAndFilterOptions,
            [listToFilter]: { ...sortAndFilterOptions[listToFilter], sort: '', filter: '' }
        }));
        // TODO get all tracks when clearing
        if (listToFilter === 'tracks') {
            getTracks
        }
        dispatch(setFilterSortMenu(''));
    }

    const toggleApplyButton = () => {
        if (sortAndFilterOptions[listToFilter].filter.length === 0 && sortAndFilterOptions[listToFilter].sort.length === 0) {
            setDisableApplyButton(true);
        } else {
            setDisableApplyButton(false);
        }
    }

    const sortList = sortType => {
        dispatch(setSortAndFilterOptions({
            ...sortAndFilterOptions,
            [listToFilter]: { ...sortAndFilterOptions[listToFilter], sort: isSelected('sort', sortType) ? '' : sortType }
        }));
    }

    const filterList = filterType => {
        dispatch(setSortAndFilterOptions({
            ...sortAndFilterOptions,
            [listToFilter]: { ...sortAndFilterOptions[listToFilter], filter: isSelected('filter', filterType) ? '' : filterType }
        }));
    }

    const closeMenu = () => {
        dispatch(setFilterSortMenu(''));
    }

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

    const applyFilterAndSort = async () => {
        dispatch(setActivityIndicator(true));
        if (listToFilter === 'tracks') {
            if (sortAndFilterOptions.tracks.filter.length > 0) {
                const idQueryList = [];

                if (sortAndFilterOptions.tracks.filter === 'favourites') {
                    await usersRef.doc(auth().currentUser.uid).get().then(async response => {
                        response.data().favourites.forEach(id => {idQueryList.push(tracksRef.doc(id))});

                        let favTracks = await Promise.all(idQueryList.map(async query => {return await query.get()}));

                        getTrackImages(sortTracks(favTracks.map(track => track.data())));
                    });
                } else if (sortAndFilterOptions.tracks.filter === 'notListened') {
                    await usersRef.doc(auth().currentUser.uid).get().then(async response => {
                        const listenedIds = response.data().listened;

                        tracksRef.get().then(response => {
                            const resp = response.docs.map(doc => doc.data());

                            getTrackImages(sortTracks(resp.filter(f => !listenedIds.includes(f.id))));
                        })
                    })
                }
            }
            if (sortAndFilterOptions.tracks.filter.length === 0 && sortAndFilterOptions.tracks.sort.length > 0) {
                const sortTypeSplit = sortAndFilterOptions.tracks.sort.split('-');
                tracksRef.orderBy(sortTypeSplit[0], sortTypeSplit[1]).get().then(response => {
                    dispatch(setActivityIndicator(false));
                    getTrackImages(response.docs.map(doc => doc.data()));
                })
            }
        } else if (listToFilter === 'artists') {
            const split = sortAndFilterOptions.artists.sort.split('-');
            await usersRef.orderBy(split[0], split[1]).limit(20).get().then(async response => {
                const artistresponse = response.docs.map(doc => doc.data());

                await tracksRef.get().then(resp => {
                    const allTracks = resp.docs.map(doc => doc.data());

                    artistresponse.forEach((artist, index) => {
                        if (allTracks.length > 0) {
                            artistresponse[index]['trackAmount'] = allTracks.filter(track => track.artistId === artist.userId).length;
                        } else {
                            artistresponse[index]['trackAmount'] = 0;
                        }
                    });

                    // TODO use sortby function to sort

                    dispatch(artists(artistresponse));
                });


                dispatch(setActivityIndicator(false));
            })
        }


        dispatch(setFilterSortMenu(''));
    }

    const sortTracks = tracks => {
        if (sortAndFilterOptions[listToFilter].sort.length > 0) {
            const split = sortAndFilterOptions[listToFilter].sort.split('-');

            split[1] === 'asc' ? tracks.sort((a, b) => (a[split[0]] > b[split[0]]) ? 1 : -1) : tracks.sort((a, b) => (a[split[0]] < b[split[0]]) ? 1 : -1);
        }
        return tracks;
    }

    return [backgroundColor, clear, disableApplyButton, sortList, filterList, closeMenu, isSelected, applyFilterAndSort, screenWidth, menuWidth, error];
}

export default useFilterAndSort;