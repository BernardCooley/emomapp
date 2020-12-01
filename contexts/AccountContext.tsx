import React, { useContext, useState } from 'react';

interface AccountContextType {
    isFormOpen: Boolean,
    isUploading: Boolean,
    updateUploading: (uploading: Boolean) => void,
    updateFormOpen: (openClose: Boolean) => void
};

export const AccountContext = React.createContext<AccountContextType>({
    isFormOpen: false,
    isUploading: false,
    updateUploading: () => null,
    updateFormOpen: () => null
});

export const PlayerContextProvider: React.FC = props => {
    const [formOpen, setFormOpen] = useState<Boolean>(false);
    const [uploading, setUploading] = useState<Boolean>(false);

    const updateUploading = (uploading: Boolean) => {
        setUploading(uploading);
    }

    const updateFormOpen = (openClose: Boolean) => {
        setFormOpen(openClose);
    }

    const value: AccountContextType = {
        isFormOpen: formOpen,
        isUploading: uploading,
        updateFormOpen,
        updateUploading
    }

    return (
        <AccountContext.Provider value={value}>
            {props.children}
        </AccountContext.Provider>
    )
}

export const useAccountContext = () => useContext(AccountContext);