import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { TRACKS_BY_ARTIST } from '../queries/graphQlQueries';


const TracksByArtist = artistId => {
    const [tracks, setTracks] = useState(0);

    const { loading, error, data, refetch } = useQuery(
        TRACKS_BY_ARTIST,
        {
            variables: {
                _artistId: artistId
            }
        }
    );

    useEffect(() => {
        if(!loading) {
            setTracks(data.tracks);
        }
    }, [data]);

    return tracks;
}

export default TracksByArtist;