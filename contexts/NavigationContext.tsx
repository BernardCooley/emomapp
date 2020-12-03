import React, { FC, createContext, useContext, useState } from 'react';

interface NavigationContextType {
    currentScreen: String,
    updateCurrentScreen: (screenName: String) => void,
    snackbarMessage: String,
    updateSnackbarMessage: (message: String) => void,
    activityIndicator: Boolean,
    updateActivityIndicator: (visible: Boolean) => void
};

export const NavigationContext = createContext<NavigationContextType>({
    currentScreen: '',
    updateCurrentScreen: () => null,
    snackbarMessage: '',
    updateSnackbarMessage: () => null,
    activityIndicator: false,
    updateActivityIndicator: () => null
});

export const NavigationContextProvider: FC = props => {
    const [currentScreen, setCurrentScreen] = useState<String>('');
    const [snackbarMessage, setSnackbarMessage] = useState<String>('');
    const [activityIndicator, setActivityIndicator] = useState<Boolean>(false);

    const updateCurrentScreen = (screenName: String) => {
        setCurrentScreen(screenName);
    }

    const updateSnackbarMessage = (message: String) => {
        setSnackbarMessage(message);
    }

    const updateActivityIndicator = (visible: Boolean) => {
        setActivityIndicator(visible);
    }

    const value: NavigationContextType = {
        currentScreen: currentScreen,
        updateCurrentScreen,
        snackbarMessage: snackbarMessage,
        updateSnackbarMessage,
        activityIndicator: activityIndicator,
        updateActivityIndicator
    }

    return (
        <NavigationContext.Provider value={value}>
            {props.children}
        </NavigationContext.Provider>
    )
}

export const useNavigationContext = () => useContext(NavigationContext);