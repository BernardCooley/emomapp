import { useState, useEffect } from 'react';
import axios from 'axios';
// import { useMutation, gql } from '@apollo/client';

// const ADD_NEW_TRACK = gql`
//         mutation createTrack(
//             $album: String, 
//             $artistId: String!, 
//             $description: String, 
//             $genre: String, 
//             $id: ID!, 
//             $title: String!, 
//             $duration: Int!
//         ) {
//             createTrack( input: {
//                 album : $album,
//                 artistId : $artistId,
//                 description : $description,
//                 genre : $genre,
//                 title : $title,
//                 duration : $duration,
//             }) {
//                 album
//                 artistId
//                 description
//                 genre
//                 id
//                 title
//                 duration
//             }
//         }
//     `;

const useTracks = query => {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState([]);
    const [tracksQuery, setTracksQuery] = useState('');
    // const [createTrack] = useMutation(ADD_NEW_TRACK);

    setTracksQuery(query);

    useEffect(() => {
        getTracks(tracksQuery);
    }, []);

    const getTracks = async tracksQuery => {
        console.log('render =============================================================');
        if(tracksQuery) {
            const result = await axios.post(
                'http://10.0.2.2:4000/graphql', {
                query: tracksQuery
            }).catch(error => {
                setError(error);
            });

            console.log(result);

            setTracks(result.data.data);
        }
    }

    // const addTrack = () => {
    //     createTrack({
    //         variables: {
    //             album: 'Test album 1',
    //             artistId: '16bsVlIoreaM8ALWuK6ym7T7V3m2',
    //             description: 'Test desc 1',
    //             genre: 'Techno',
    //             title: 'Test title 1',
    //             duration: 350,
    //         }
    //     })
    // }

    return [tracks, getTracks, error];


}

export default useTracks;