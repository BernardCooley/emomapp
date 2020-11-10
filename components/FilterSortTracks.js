import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Menu, Divider, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import useFilterAndSort from '../hooks/useFilterAndSort';

const FilterSortTracks = () => {
    const filterSortMenuType = useSelector(state => state.filterSortMenu);

    const [backgroundColor, clear, disableApplyButton, sortList, filterList, closeMenu, isSelected, applyFilterAndSort, screenWidth, menuWidth, error] = useFilterAndSort('tracks');

    return (
        <Menu
            visible={filterSortMenuType.length > 0 && filterSortMenuType === 'tracks'}
            style={{ ...styles.menu, width: menuWidth }}
            onDismiss={closeMenu}
            anchor={{ x: (screenWidth / 2) + (menuWidth / 2), y: 30 }}>

            <Text style={styles.sortFilterLabel}>Sort by:</Text>
            <Menu.Item style={backgroundColor('sort', 'artist-asc')} onPress={() => sortList('artist-asc')} icon="sort-variant" title="Artist name (asc)" />
            <Menu.Item style={backgroundColor('sort', 'artist-desc')} onPress={() => sortList('artist-desc')} icon="sort-reverse-variant" title="Artist name (desc)" />
            <Menu.Item style={backgroundColor('sort', 'title-asc')} onPress={() => sortList('title-asc')} icon="sort-variant" title="Track title (asc)" />
            <Menu.Item style={backgroundColor('sort', 'title-desc')} onPress={() => sortList('title-desc')} icon="sort-reverse-variant" title="Track title (desc)" />
            <Menu.Item style={backgroundColor('sort', 'releaseDate-asc')} onPress={() => sortList('releaseDate-asc')} icon="sort-ascending" title="Newest" />
            <Menu.Item style={backgroundColor('sort', 'releaseDate-desc')} onPress={() => sortList('releaseDate-desc')} icon="sort-descending" title="Oldest" />

            <Divider />

            <Text style={styles.sortFilterLabel}>Filter by:</Text>
            <Menu.Item style={backgroundColor('filter', 'favourites')} onPress={() => filterList('favourites')} icon="heart" title="Favourites" />
            <Menu.Item style={backgroundColor('filter', 'notListened')} onPress={() => filterList('notListened')} icon="ear-hearing-off" title="Not listened" />

            <Divider />

            <View style={styles.buttonContainer}>
                <Button disabled={disableApplyButton} onPress={applyFilterAndSort}>Apply</Button>
                <Button disabled={disableApplyButton} onPress={clear}>Clear</Button>
            </View>
        </Menu>
    )
};

FilterSortTracks.propTypes = {

};

const styles = StyleSheet.create({
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