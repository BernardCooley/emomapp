import React, { FC, createContext, useContext, useState } from 'react';

interface TracksContextType {
    refetch: Boolean,
    triggerRefetch: (trigger: Boolean) => void
};

export const TracksContext = createContext<TracksContextType>({
    refetch: false,
    triggerRefetch: () => null
});

export const TracksContextProvider: FC = props => {
    const [refetch, setRefetch] = useState<Boolean>(false);

    const triggerRefetch = (refetch: Boolean) => {
        setRefetch(refetch);
    }

    const value: TracksContextType = {
        refetch: refetch,
        triggerRefetch
    }

    return (
        <TracksContext.Provider value={value}>
            {props.children}
        </TracksContext.Provider>
    )
}

export const useTracksContext = () => useContext(TracksContext);