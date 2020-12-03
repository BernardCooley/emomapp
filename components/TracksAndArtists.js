import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, BackHandler, Alert, SafeAreaView, RefreshControl, Keyboard, View, ScrollView, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from 'prop-types';
import { Title, Searchbar, ActivityIndicator, Text, useTheme, FAB, IconButton } from 'react-native-paper';
import { useQuery } from '@apollo/client';

import { setFilterSortMenu } from '../Actions/index';
import ArtistsList from '../components/ArtistsList';
import TracksList from '../components/TracksList';
import { ALL_TRACKS_TRACKLIST, ALL_ARTISTS_ALL_DETAILS } from '../queries/graphQlQueries';
import { useNavigationContext } from '../contexts/NavigationContext';


const TracksAndArtists = ({ navigation, listType }) => {
    const navigationContext = useNavigationContext();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scroll, setScroll] = useState(null);
    const [showingSearchResults, setShowingSearchResults] = useState(false);
    const [displayBackToTopIcon, setDisplayBackToTopIcon] = useState(false);
    const screenHeight = Dimensions.get("window").height;

    let query = null;

    if(listType === 'artists') {
        query = ALL_ARTISTS_ALL_DETAILS
    }else if(listType === 'tracks') {
        query = ALL_TRACKS_TRACKLIST
    }

    const { loading, error, data, refetch } = useQuery(query);

    useEffect(() => {
        if (searchQuery.length === 0) {
            refresh();
        }
    }, [searchQuery]);

    const findDimesions = scrollHeight => {
        if (Math.round(scrollHeight) + 200 > Math.round(screenHeight)) {
            setDisplayBackToTopIcon(true);
        } else {
            setDisplayBackToTopIcon(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Exit app", "Are you sure you want to exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, [])
    );

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const refresh = () => {
        setSearchQuery('');
        setRefreshing(true);
        refetch();
        wait(2000).then(() => setRefreshing(false));
        setShowingSearchResults(false);
    };

    const onChangeSearch = query => {
        setSearchQuery(query);
    };

    const contains = (string, substring) => {
        return string.toLowerCase().indexOf(substring.toLowerCase()) !== -1;
    }

    const search = async () => {
        
    }

    const goToTop = () => {
        scroll.scrollTo({ x: 0, y: 0, animated: true });
    }

    const openFilterModal = () => {
        dispatch(setFilterSortMenu(listType));
    }

    return (
        <>
            {data &&
                <SafeAreaView style={styles.container}>
                    <View style={styles.searchFilterContainer}>
                        <Searchbar
                            style={styles.searchField}
                            icon='magnify'
                            onIconPress={search}
                            clearIcon='close'
                            placeholder={`Search ${listType}`}
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            onSubmitEditing={search}
                        />
                        <IconButton onPress={openFilterModal} style={styles.filterIcon} animated icon='filter-variant' size={30} />
                    </View>
                {navigationContext.activityIndicator ?
                        <ActivityIndicator style={styles.activityIndicatorContainer} size='large' /> :
                        <>
                            <ScrollView
                                onContentSizeChange={(width, height) => {
                                    findDimesions(height);
                                }}
                                ref={c => { setScroll(c) }}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                                }
                                style={styles.scrollView}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: 'space-between'
                                }}>
                                {showingSearchResults &&
                                    <Text style={styles.resultsLabel}>{data[listType].length} results found for: "{searchQuery}"</Text>
                                }
                                {data[listType].length > 0 ?
                                    <>
                                        {listType === 'artists' ?
                                            <ArtistsList artists={data} navigation={navigation} /> :
                                            <TracksList tracks={data} navigation={navigation} />
                                        }
                                    </> :
                                    <>
                                        <View style={styles.noResultsLabel}>
                                            <Title >No {listType} found</Title>
                                        </View>
                                    </>
                                }
                            </ScrollView>
                            {displayBackToTopIcon &&
                                <FAB
                                    animated
                                    small
                                    icon="arrow-up-drop-circle-outline"
                                    style={{ ...styles.toTopIcon, backgroundColor: colors.lightIconsAndText }}
                                    onPress={goToTop}
                                />
                            }
                        </>
                    }
                </SafeAreaView>
            }
        </>
    )
};

TracksAndArtists.propTypes = {
    tracks: PropTypes.array,
    artists: PropTypes.array,
    navigation: PropTypes.object
};

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 50
    },
    noResultsLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
    },
    activityIndicatorContainer: {
        position: 'relative',
        top: 250
    },
    resultsLabel: {
        fontWeight: 'bold',
        padding: 10
    },
    toTopIcon: {
        position: 'absolute',
        bottom: 60,
        left: 10,
        zIndex: 100
    },
    searchFilterContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    searchField: {
        flexGrow: 1
    },
    filterIcon: {
        width: 50
    }
});

export default TracksAndArtists;