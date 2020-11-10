import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

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

    useEffect(() => {
        toggleApplyButton();
    }, [sortAndFilterOptions]);

    const isSelected = (sortOrFilter, type) => {
        // TODO doesnt update selected
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
        setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], filter: ''});
        setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], sort: ''});
        dispatch(setFilterSortMenu(''));
    }

    const toggleApplyButton = () => {
        if (sortAndFilterOptions[listToFilter].filter.length === 0 && sortAndFilterOptions[listToFilter].sort.length === 0) {
            setDisableApplyButton(true);
        } else {
            setDisableApplyButton(false);
        }
    }

    const sortList = sort => {
        if (isSelected('sort', sort)) {
            setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], sort: ''});
        } else {
            setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], sort: sort});
        }
    }

    const filterList = filterType => {
        if (isSelected('filter', filterType)) {
            setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], filter: ''});
        } else {
            setSortAndFilterOptions({...sortAndFilterOptions[listToFilter], filter: filterType});
        }
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
            if (sortAndFilterOptions[listToFilter].filter.length > 0) {
                const idQueryList = [];

                if (sortAndFilterOptions[listToFilter].filter === 'favourites') {
                    await usersRef.doc(auth().currentUser.uid).get().then(async response => {
                        response.data().favourites.forEach(id => {idQueryList.push(tracksRef.doc(id))});

                        let favTracks = await Promise.all(idQueryList.map(async query => {return await query.get()}));

                        getTrackImages(sortTracks(favTracks.map(track => track.data())));
                    });
                } else if (sortAndFilterOptions[listToFilter].filter === 'notListened') {
                    await usersRef.doc(auth().currentUser.uid).get().then(async response => {
                        const listenedIds = response.data().listened;

                        tracksRef.get().then(response => {
                            const resp = response.docs.map(doc => doc.data());

                            getTrackImages(sortTracks(resp.filter(f => !listenedIds.includes(f.id))));
                        })
                    })
                }
            }
            if (sortAndFilterOptions[listToFilter].filter.length === 0 && sortAndFilterOptions[listToFilter].sort.length > 0) {
                const sortTypeSplit = sortAndFilterOptions[listToFilter].sort.split('-');
                tracksRef.orderBy(sortTypeSplit[0], sortTypeSplit[1]).get().then(response => {
                    dispatch(setActivityIndicator(false));
                    // TODO apply updated tracks
                    console.log(response.docs.map(doc => doc.data().title));
                })
            }
        } else if (listToFilter === 'artists') {
            // TODO filter for artists
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