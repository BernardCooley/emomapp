import React, { FC, createContext, useContext, useState, useEffect } from 'react';

interface AccountContextType {
    isFormOpen: Boolean,
    isUploading: Boolean,
    updateUploading: (uploading: Boolean) => void,
    toggleForm: (toggle: Boolean) => void
};

export const AccountContext = createContext<AccountContextType>({
    isFormOpen: false,
    isUploading: false,
    updateUploading: () => null,
    toggleForm: () => null
});

export const AccountContextProvider: FC = props => {
    const [formOpen, setFormOpen] = useState<Boolean>(false);
    const [uploading, setUploading] = useState<Boolean>(false);

    const updateUploading = (uploading: Boolean) => {
        setUploading(uploading);
    }

    const toggleForm = (toggle: Boolean) => {
        setFormOpen(toggle);
    }

    const value: AccountContextType = {
        isFormOpen: formOpen,
        isUploading: uploading,
        toggleForm,
        updateUploading
    }

    return (
        <AccountContext.Provider value={value}>
            {props.children}
        </AccountContext.Provider>
    )
}

export const useAccountContext = () => useContext(AccountContext);