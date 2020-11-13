import { useState, useEffect } from 'react';
import axios from 'axios';

const useTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState([]);
    const [query, setquery] = useState(`
        {
            tracks {
                id
                title
                artistId
                description
                duration
            }
        }
    `);

    useEffect(() => {
        getTracks();
    }, []);

    const getTracks = async () => {
        console.log(query);
        const result = await axios.post(
            'http://localhost:4000/graphql', {
            query: query
        }).catch(error => {
            console.log(error);
            setError(error);
        });

        setTracks(result);
    }

    return [tracks, getTracks, error];


}

export default useTracks;