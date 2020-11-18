import { useMutation } from '@apollo/client';

import { ADD_NEW_TRACK } from '../queries/graphQlQueries';


const useTracks = () => {
    const [createNewTrack] = useMutation(ADD_NEW_TRACK);

    const addTrack = newTrackData => {
        createNewTrack({
            variables: newTrackData
        }).then(() => {
            getTracks();
        })
    }

    // {
        // album: 'Test album 1',
        //     artistId: '16bsVlIoreaM8ALWuK6ym7T7V3m2',
        //         description: 'Test desc 1',
        //             genre: 'Techno',
        //                 title: 'Test title 1',
        //                     duration: 350,
        //     }

    return [addTrack, loading, error];


    }

    export default useTracks;