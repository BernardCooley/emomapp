import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Menu, Divider, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterSortMenu } from '../Actions/index';

import formStyles from '../styles/FormStyles';
import useFilterAndSort from '../hooks/useFilterAndSort';

const FilterSortTracks = () => {
    const dispatch = useDispatch();
    const filterSortMenuType = useSelector(state => state.filterSortMenu);
    const screenWidth = Dimensions.get("window").width;
    const menuWidth = 280;

    const [backgroundColor, clear, disableApplyButton, sort, filter, closeMenu, isSelected, error] = useFilterAndSort('artists');

    const applyFilterAndSort = () => {
        dispatch(setFilterSortMenu(''));
    }

    return (
        <Menu
            visible={filterSortMenuType.length > 0 && filterSortMenuType === 'tracks'}
            style={{ ...styles.menu, width: menuWidth }}
            onDismiss={closeMenu}
            anchor={{ x: (screenWidth / 2) + (menuWidth / 2), y: 30 }}>

            <Text style={styles.sortFilterLabel}>Sort by:</Text>
            <Menu.Item style={backgroundColor('sort', 'artist-asc')} onPress={() => sort('artist-asc')} icon="sort-variant" title="Artist name (asc)" />
            <Menu.Item style={backgroundColor('sort', 'artist-desc')} onPress={() => sort('artist-desc')} icon="sort-reverse-variant" title="Artist name (desc)" />
            <Menu.Item style={backgroundColor('sort', 'title-asc')} onPress={() => sort('title-asc')} icon="sort-variant" title="Track title (asc)" />
            <Menu.Item style={backgroundColor('sort', 'title-desc')} onPress={() => sort('title-desc')} icon="sort-reverse-variant" title="Track title (desc)" />
            <Menu.Item style={backgroundColor('sort', 'newest')} onPress={() => sort('newest')} icon="sort-ascending" title="Newest" />
            <Menu.Item style={backgroundColor('sort', 'oldest')} onPress={() => sort('oldest')} icon="sort-descending" title="Oldest" />

            <Divider />

            <Text style={styles.sortFilterLabel}>Filter by:</Text>
            <Menu.Item style={backgroundColor('filter', 'favourites')} onPress={() => filter('favourites')} icon="heart" title="Favourites" />
            <Menu.Item style={backgroundColor('filter', 'listened')} disabled={isSelected('filter', 'notListened')} onPress={() => filter('listened')} icon="ear-hearing" title="Listened" />
            <Menu.Item style={backgroundColor('filter', 'notListened')} disabled={isSelected('filter', 'listened')} onPress={() => filter('notListened')} icon="ear-hearing-off" title="Not listened" />

            <Divider />

            <View style={styles.buttonContainer}>
                <Button disabled={disableApplyButton} onPress={applyFilterAndSort}>Apply</Button>
                <Button onPress={clear}>Clear</Button>
            </View>
        </Menu>
    )
};

FilterSortTracks.propTypes = {

};

const styles = StyleSheet.create({
    ...formStyles,
    sortFilterLabel: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 18
    },
    buttonContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default FilterSortTracks;