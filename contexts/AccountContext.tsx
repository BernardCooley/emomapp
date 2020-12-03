import React, { FC, createContext, useContext, useState, useEffect } from 'react';

interface AccountContextType {
    isManageTracksModalOpen: Boolean,
    isFormOpen: Boolean,
    isUploading: Boolean,
    toggleManageTracksModal: (toggle: Boolean) => void,
    updateUploading: (uploading: Boolean) => void,
    toggleForm: (toggle: Boolean) => void
};

export const AccountContext = createContext<AccountContextType>({
    isManageTracksModalOpen: false,
    isFormOpen: false,
    isUploading: false,
    toggleManageTracksModal: () => null,
    updateUploading: () => null,
    toggleForm: () => null
});

export const AccountContextProvider: FC = props => {
    const [manageTracksModalOpen, setManageTracksModalOpen] = useState<Boolean>(false);
    const [formOpen, setFormOpen] = useState<Boolean>(false);
    const [uploading, setUploading] = useState<Boolean>(false);

    const updateUploading = (uploading: Boolean) => {
        setUploading(uploading);
    }

    const toggleForm = (toggle: Boolean) => {
        setFormOpen(toggle);
    }

    const toggleManageTracksModal = (toggle: Boolean) => {
        setManageTracksModalOpen(toggle);
    }

    const value: AccountContextType = {
        isManageTracksModalOpen: manageTracksModalOpen,
        isFormOpen: formOpen,
        isUploading: uploading,
        toggleManageTracksModal,
        updateUploading,
        toggleForm
    }

    return (
        <AccountContext.Provider value={value}>
            {props.children}
        </AccountContext.Provider>
    )
}

export const useAccountContext = () => useContext(AccountContext);