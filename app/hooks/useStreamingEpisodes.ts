// useStreamingEpisodes.ts
import { useEffect, useState } from 'react';

interface StreamingEpisode {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
}

const useStreamingEpisodes = (
    animeId: number | undefined,
    activeTab: string
) => {
    const [streamingEpisodes, setStreamingEpisodes] = useState<
        StreamingEpisode[] | null
    >(null);

    useEffect(() => {
        if (animeId === undefined) {
            return; // Ne pas exécuter la requête si animeId est undefined
        }

        const fetchStreamingEpisodes = async () => {
            if (!animeId || activeTab !== 'watch') return;
            const query = `
        query ($id: Int) {
          Media(id: $id) {
            streamingEpisodes {
              site
              thumbnail
              title
              url
            }
          }
        }
      `;
            const variables = { id: animeId };

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables }),
                });
                const { data } = await response.json();
                setStreamingEpisodes(data?.Media?.streamingEpisodes || []);
            } catch (error) {
                console.error('Failed to fetch streaming episodes:', error);
            }
        };

        fetchStreamingEpisodes();
    }, [animeId, activeTab]);

    return streamingEpisodes;
};

export default useStreamingEpisodes;
