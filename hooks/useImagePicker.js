import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';

import { useNavigationContext } from '../contexts/NavigationContext';


const useImagePicker = () => {
    const navigationContext = useNavigationContext();
    const [image, setImage] = useState({});

    const options = {
        title: 'Select artist image',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    const lauchFileUploader = async () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let split = response.path.split('.');
                split = split[split.length - 1];

                if (split === 'jpeg' || split === 'jpg' || split === 'png') {
                    setImage({
                        uri: response.uri,
                        name: response.fileName,
                        path: response.path,
                        ext: split,
                        type: response.type
                    })
                } else {
                    navigationContext.updateSnackbarMessage(`Only jpeg, jpg, png allowed.`);
                }
            }
        });
    }

    const removeImage = () => {
        setImage({});
    }

    return [image, lauchFileUploader, removeImage];
}

export default useImagePicker;