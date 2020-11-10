import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Menu, Divider, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import useFilterAndSort from '../hooks/useFilterAndSort';

const FilterSortArtists = () => {
    const filterSortMenuType = useSelector(state => state.filterSortMenu);

    const [backgroundColor, clear, disableApplyButton, sortList, filterList, closeMenu, isSelected, applyFilterAndSort, screenWidth, menuWidth, error] = useFilterAndSort('artists');

    return (
        <Menu
            visible={filterSortMenuType.length > 0 && filterSortMenuType === 'artists'}
            style={{ ...styles.menu, width: menuWidth }}
            onDismiss={closeMenu}
            anchor={{ x: (screenWidth / 2) + (menuWidth / 2), y: 30 }}>

            <Text style={styles.sortFilterLabel}>Sort by:</Text>
            <Menu.Item style={backgroundColor('sort', 'artist-asc')} onPress={() => sortList('artist-asc')} icon="sort-variant" title="Artist name (asc)" />
            <Menu.Item style={backgroundColor('sort', 'artist-desc')} onPress={() => sortList('artist-desc')} icon="sort-reverse-variant" title="Artist name (desc)" />
            <Menu.Item style={backgroundColor('sort', 'track-amount')} onPress={() => sortList('track-amount')} icon="music-box-multiple-outline" title="Track amount" />

            <Divider />

            <Text style={styles.sortFilterLabel}>Filter by:</Text>
            <Menu.Item style={backgroundColor('filter', 'with-tracks')} onPress={() => filterList('with-tracks')} icon="music-note-outline" title="With tracks" />
            
            <Divider />

            <View style={styles.buttonContainer}>
                <Button disabled={disableApplyButton} onPress={applyFilterAndSort}>Apply</Button>
                <Button disabled={disableApplyButton} onPress={clear}>Clear</Button>
            </View>
        </Menu>
    )
};

FilterSortArtists.propTypes = {

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

export default FilterSortArtists;