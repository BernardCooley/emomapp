import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';

import { setFilterSortMenu } from '../Actions/index';

const useFilterAndSort = (filterList) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const [sortType, setSortType] = useState('');
    const [filters, setFilters] = useState([]);
    const [error, setError] = useState(null);
    const [disableApplyButton, setDisableApplyButton] = useState(true);

    useEffect(() => {
        toggleApplyButton();
    }, [filters, sortType])

    const isSelected = (sortOrFilter, type) => {
        if (sortOrFilter === 'sort') {
            return sortType === type;
        } else {
            return filters.filter(filter => filter === type).length > 0;
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
        setFilters([]);
        setSortType('');
        dispatch(setFilterSortMenu(''));
    }

    const toggleApplyButton = () => {
        if (filters.length === 0 && sortType.length === 0) {
            setDisableApplyButton(true);
        }else {
            setDisableApplyButton(false);
        }
    }

    const sort = sort => {
        if(isSelected('sort', sort)) {
            setSortType('');
        }else {
            setSortType(sort);
        }
    }

    const filter = filterType => {
        if (isSelected('filter', filterType)) {
            setFilters(filters => filters.filter(filter => filter !== filterType));
        } else {
            setFilters(filters => [...filters, filterType]);
        }
    }

    const closeMenu = () => {
        dispatch(setFilterSortMenu(''));
    }

    return [backgroundColor, clear, disableApplyButton, sort, filter, closeMenu, isSelected, error];
}

export default useFilterAndSort;