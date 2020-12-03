import React from 'react';

import { AccountContextProvider } from './AccountContext';
import { PlayerContextProvider } from './PlayerContext';
import { NavigationContextProvider } from './NavigationContext';

const ContextWrappers = (props) => {
    return (
        <NavigationContextProvider>
            <PlayerContextProvider>
                <AccountContextProvider>
                    {props.children}
                </AccountContextProvider>
            </PlayerContextProvider>
        </NavigationContextProvider>
    )
};

export default ContextWrappers;