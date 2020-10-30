import React, { useContext, useEffect, useState } from 'react';
import RNTrackPlayer, { State as TrackPlayerState, STATE_PAUSED, STATE_PLAYING, STATE_STOPPED, Track } from 'react-native-track-player';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useSelector } from 'react-redux';

interface PlayerContextType {
    isPlaying: boolean;
    isPaused: boolean;
    isStopped: boolean;
    isEmpty: boolean;
    currentTrack: Track | null;
    trackQueue: Array<null | Track>;
    play: (track?: Track, queue?: Boolean) => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    seekTo: (seconds: number) => void;
    clearQueue: () => void;
    shuffle: () => void;
}

export const PlayerContext = React.createContext<PlayerContextType>({
    isPlaying: false,
    isPaused: false,
    isStopped: false,
    isEmpty: false,
    currentTrack: null,
    trackQueue: null,
    play: () => null,
    pause: () => null,
    next: () => null,
    previous: () => null,
    seekTo: () => null,
    clearQueue: () => null,
    shuffle: () => null
})

export const PlayerContextProvider: React.FC = props => {
    const [playerState, setPlayerState] = useState<null | TrackPlayerState>(null);
    const [currentTrack, setCurrentTrack] = useState<null | Track>(null);
    const [trackQueue, setTrackQueue] = useState<Array<null | Track>>(null);
    const tracksRef = firestore().collection('tracks');
    const trackFilters = useSelector(state => state.trackListFilters);

    useEffect(() => {
        const listener = RNTrackPlayer.addEventListener(
            'playback-state',
            ({ state }: { state: TrackPlayerState }) => {
                setPlayerState(state);
            }
        )

        return () => {
            listener.remove();
        }
    }, []);

    const getCurrentQueue = async () => {
        return (await RNTrackPlayer.getQueue()).map(track => {
            return track
        });
    }

    const play = async (track?: Track, queue?: Boolean) => {
        const currentQueue = await getCurrentQueue();

        if (!track && !queue) {
            // No track clicked and not added to queue
            if (currentTrack) {
                await RNTrackPlayer.play()
            }
            return;
        } else if (track && !queue) {
            if (currentQueue.length === 0) {
                // Queue is empty
                await RNTrackPlayer.add([track]).then(async () => {
                    setCurrentTrack(track);
                    setTrackQueue(await getCurrentQueue());
                })
            } else {
                if (currentQueue.filter(tr => tr.id === track.id).length > 0) {
                    // Track is already in queue
                    await RNTrackPlayer.remove(track.id).then(async () => {
                        await RNTrackPlayer.add([track]).then(async () => {
                            skipToTrack(track);
                        })
                    })
                } else {
                    const index = currentQueue.indexOf(currentQueue.filter(tr => tr.id === currentTrack.id)[0]);

                    if (currentQueue.length > 1) {
                        // More than 1 track in queue
                        if (currentQueue.length === index + 1) {
                            // Current IS the last track
                            await RNTrackPlayer.add([track]).then(async () => {
                                skipToTrack(track);
                            })
                        } else {
                            // Current is NOT the last track
                            await RNTrackPlayer.add([track], currentQueue[index + 1].id).then(async () => {
                                skipToTrack(track);
                            });
                        }
                    } else {
                        // Only 1 track in queue
                        const current = currentTrack;
                        await RNTrackPlayer.reset().then(async () => {
                            await RNTrackPlayer.add([current, track]).then(async () => {
                                skipToTrack(track);
                            })
                        });
                    }
                }
            }
            await RNTrackPlayer.play()
        } else if (track && queue) {
            if (currentQueue.filter(tr => tr.id === track.id).length > 0) {
                alert('Already in queue');
            } else {
                await RNTrackPlayer.add([track]).then(async () => {
                    setTrackQueue(await getCurrentQueue());
                })
            }
        }
    }

    const pause = async () => {
        await RNTrackPlayer.pause()
    }

    const next = async () => {
        await RNTrackPlayer.skipToNext().then(async () => {
            await getCurrentQueue().then(tracks => {
                tracks.forEach(async track => {
                    if (track.id === await RNTrackPlayer.getCurrentTrack()) {
                        setCurrentTrack(track);
                    }
                })
            })
        })
    }

    const previous = async () => {
        await RNTrackPlayer.skipToPrevious().then(async () => {
            await getCurrentQueue().then(tracks => {
                tracks.forEach(async track => {
                    if (track.id === await RNTrackPlayer.getCurrentTrack()) {
                        setCurrentTrack(track);
                    }
                })
            })
        })
    }

    const seekTo = async (seconds: number) => {
        await RNTrackPlayer.seekTo(seconds);
    }

    const clearQueue = async () => {
        const currentQueue = await getCurrentQueue();
        const currentTrackFromQueue = currentQueue.filter(tr => tr.id === currentTrack.id)[0];
        const index = currentQueue.indexOf(currentTrackFromQueue);
        const queuePrevious = currentQueue.splice(0, index + 1);
        const trackToSkipTo = queuePrevious[queuePrevious.length - 1];

        await RNTrackPlayer.reset().then(async () => {
            await RNTrackPlayer.add(queuePrevious).then(async () => {
                skipToTrack(trackToSkipTo);
            })
        })
    }

    const skipToTrack = async (track: Track) => {
        await RNTrackPlayer.skip(track.id).then(async () => {
            setCurrentTrack(track);
            setTrackQueue(await getCurrentQueue());
        })
    }

    const getShuffleTrackIds = async queryList => {
        const ids = await Promise.all(
            queryList.map(async query => {
                let idResponse = await query;
                return idResponse.docs.map((doc: any) => doc.data().id);
            })
        )

        const flattened = [];

        ids.forEach(id => {
            id.forEach(i => {
                flattened.push(i);
            });
        })

        return flattened;
    }

    const shuffle = async () => {
        const queryList = [];
        const activeFilters = [];

        trackFilters.forEach(filter => {
            if (filter['value'].length > 0) {
                activeFilters.push(filter)
            }
        });

        if (activeFilters.length > 0) {
            activeFilters.forEach((filter: Object) => {
                queryList.push(tracksRef.where(filter['key'], '==', filter['value']).get());
            })
        } else {
            queryList.push(tracksRef.get());
        }

        await getShuffleTrackIds(queryList).then(async (ids: Array<string>) => {
            const index = ids.indexOf(currentTrack.id);
            if (index > -1) {
                ids.splice(index, 1);
            }

            playRandomTrack(ids);
        })
    }

    const playRandomTrack = async (ids: Array<string>) => {
        await tracksRef.doc(ids[Math.floor(Math.random() * Math.floor(ids.length))]).get().then(async resp => {
            const track = resp.data();

            await storage().ref(`trackImages/${track.id}.jpg`).getDownloadURL().then(async url => {
                track['trackImage'] = url;

                await storage().ref(`tracks/${track.id}.mp3`).getDownloadURL().then(url => {
                    track['url'] = url;
                    // still works
                    play(track);
                });
            }).catch(error => {
                console.log('GET TRACK IMAGE =========>', error)
            });
        })
    }

    const value: PlayerContextType = {
        isPlaying: playerState === STATE_PLAYING,
        isPaused: playerState === STATE_PAUSED,
        isStopped: playerState === STATE_STOPPED,
        isEmpty: playerState === null,
        currentTrack,
        trackQueue,
        pause,
        play,
        next,
        previous,
        seekTo,
        clearQueue,
        shuffle
    }

    return (
        <PlayerContext.Provider value={value}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContext = () => useContext(PlayerContext);