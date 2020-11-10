import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { setFilterSortMenu, tracks, setActivityIndicator, setSortAndFilterOptions } from '../Actions/index';

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

    // TODO why is this greyed out???
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
            // TODO change all userId to artistId
            console.log(sortAndFilterOptions.artists.sort);
            const split = sortAndFilterOptions.artists.sort.split('-');
            await usersRef.get().then(response => {
                console.log(response);
                console.log(response.docs.map(doc => doc.data()));
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