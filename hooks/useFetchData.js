import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = () => {
    const [data, setData] = useState(null);
    const [dataError, setDataError] = useState(null);

    const getData = async query => {
        const result = await axios.post(
            'https://us-central1-emom-84ee4.cloudfunctions.net/graph', {
            query: query
        }).catch(error => {
            setDataError(error);
        });

        setData(result.data.data);
    }

    return [data, getData, dataError];
}

export default useFetchData;