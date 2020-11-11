import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

import { setFilterSortMenu, setSortAndFilterOptions } from '../Actions/index';

const useFilterAndSort = (listToFilter) => {
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

    const applyFilterAndSort = async () => {
        dispatch(setFilterSortMenu(''));
    }

    return [backgroundColor, clear, disableApplyButton, sortList, filterList, closeMenu, isSelected, applyFilterAndSort, screenWidth, menuWidth, error];
}

export default useFilterAndSort;