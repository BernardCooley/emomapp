import React, { FC, createContext, useContext, useState } from 'react';

interface AccountContextType {
    isManageTracksModalOpen: Boolean,
    toggleManageTracksModal: (toggle: Boolean) => void,
    isFormOpen: Boolean,
    updateUploading: (uploading: Boolean) => void,
    isUploading: Boolean,
    toggleForm: (toggle: Boolean) => void,
    isEditing: Boolean,
    toggleEditing: (toggle: Boolean) => void,
    editTrackDetails: Object,
    updateEditTrackDetails: (details: Object) => void
};

export const AccountContext = createContext<AccountContextType>({
    isManageTracksModalOpen: false,
    toggleManageTracksModal: () => null,
    isFormOpen: false,
    updateUploading: () => null,
    isUploading: false,
    toggleForm: () => null,
    isEditing: false,
    toggleEditing: () => null,
    editTrackDetails: {},
    updateEditTrackDetails: () => null
});

export const AccountContextProvider: FC = props => {
    const [manageTracksModalOpen, setManageTracksModalOpen] = useState<Boolean>(false);
    const [formOpen, setFormOpen] = useState<Boolean>(false);
    const [uploading, setUploading] = useState<Boolean>(false);
    const [editing, setEditing] = useState<Boolean>(false);
    const [trackDetails, setTrackDetails] = useState<Object>({});

    const updateUploading = (uploading: Boolean) => {
        setUploading(uploading);
    }

    const toggleForm = (toggle: Boolean) => {
        setFormOpen(toggle);
    }

    const toggleManageTracksModal = (toggle: Boolean) => {
        setManageTracksModalOpen(toggle);
    }

    const toggleEditing = (toggle: Boolean) => {
        setEditing(toggle);
    }

    const updateEditTrackDetails = (details: Object) => {
        setTrackDetails(details);
    }

    const value: AccountContextType = {
        isManageTracksModalOpen: manageTracksModalOpen,
        toggleManageTracksModal,
        isFormOpen: formOpen,
        updateUploading,
        isUploading: uploading,
        toggleForm,
        isEditing: editing,
        toggleEditing,
        editTrackDetails: trackDetails,
        updateEditTrackDetails
    }

    return (
        <AccountContext.Provider value={value}>
            {props.children}
        </AccountContext.Provider>
    )
}

export const useAccountContext = () => useContext(AccountContext);