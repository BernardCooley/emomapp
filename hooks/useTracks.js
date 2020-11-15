import { useState, useEffect } from 'react';
import axios from 'axios';

const useTracks = query => {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        getTracks(query);
    }, []);

    const getTracks = async query => {
        if(query) {
            const result = await axios.post(
                'http://10.0.2.2:4000/graphql', {
                query: query
            }).catch(error => {
                setError(error);
            });

            setTracks(result.data.data);
        }
    }

    return [tracks, getTracks, error];


}

export default useTracks;