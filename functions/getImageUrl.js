export const getImageUrl = (artistId, imageName) => {
    const baseStorageUrl = 'https://storage.googleapis.com/emom-files/';
    return `${baseStorageUrl}${artistId}/${imageName}`;
}