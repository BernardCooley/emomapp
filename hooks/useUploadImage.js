import { useState, useEffect } from 'react';
import { UPLOAD_IMAGE } from '../queries/graphQlQueries';
import { ReactNativeFile } from 'apollo-upload-client';
import { useMutation } from '@apollo/client';

const useUploadImage = () => {
    const [url, setUrl] = useState('');
    const [dataError, setDataError] = useState(null);
    const [
        uploadImage,
        {
            loading: imageUploadLoading,
            error: imageUploadError,
            data: imageUploadData
        }
    ] = useMutation(UPLOAD_IMAGE);

    useEffect(() => {
        if(imageUploadData) {
            setUrl(setUrl);
        }
        if (imageUploadError) {
            setDataError(imageUploadError);
        }
    }, [imageUploadLoading]);

    const uploadTrackImage = (artistId, artistImage, isTrackImage, trackId) => {
        if (Object.keys(artistImage).length > 0) {
            const file = new ReactNativeFile({
                uri: artistImage.uri,
                name: artistImage.name,
                type: artistImage.type,
                ext: artistImage.ext
            });

            uploadImage({
                variables: {
                    file: file,
                    artistId: artistId,
                    isTrackImage: isTrackImage,
                    trackId: trackId
                }
            });
        }
    }


    return [url, uploadTrackImage, dataError];
}

export default useUploadImage;