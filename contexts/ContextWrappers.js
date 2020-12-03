import React from 'react';

import { AccountContextProvider } from './AccountContext';
import { PlayerContextProvider } from './PlayerContext';
import { NavigationContextProvider } from './NavigationContext';
import { TracksContextProvider } from './TracksContext';

const ContextWrappers = (props) => {
    return (
        <TracksContextProvider>
            <NavigationContextProvider>
                <PlayerContextProvider>
                    <AccountContextProvider>
                        {props.children}
                    </AccountContextProvider>
                </PlayerContextProvider>
            </NavigationContextProvider>
        </TracksContextProvider>
    )
};

export default ContextWrappers;