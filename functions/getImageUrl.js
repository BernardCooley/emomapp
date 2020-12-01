export const getImageUrl = (artistId, imageName, trackId) => {
    const baseStorageUrl = 'https://storage.googleapis.com/emom-files/';

    const url = `${baseStorageUrl}${artistId}${trackId ? `/tracks/${trackId}` : ``}/${imageName}`;

    return url;
}