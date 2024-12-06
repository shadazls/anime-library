import { Anime, StreamingEpisode } from '@/types';
import { useEffect, useState } from 'react';

const useStreamingEpisodes = (
    animeId: number | undefined,
    anime: Anime | null,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>,
    activeTab: string
) => {
    const [streamingEpisodes, setStreamingEpisodes] = useState<
        StreamingEpisode[] | null
    >(null);

    useEffect(() => {
        const fetchStreamingEpisodes = async () => {
            if (!animeId || !anime || activeTab !== 'watch') return;

            // Vérifie si les épisodes de streaming sont déjà présents dans l'objet `anime`
            if (anime.streamingEpisodes && anime.streamingEpisodes.length > 0) {
                setStreamingEpisodes(anime.streamingEpisodes);
                return;
            }

            // Requête à AniList pour récupérer les épisodes de streaming
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

                if (data?.Media?.streamingEpisodes) {
                    const formattedEpisodes = data.Media.streamingEpisodes.map(
                        (episode: any) => ({
                            site: episode.site,
                            thumbnail: episode.thumbnail,
                            title: episode.title,
                            url: episode.url,
                        })
                    );

                    // Ajouter les épisodes dans la base de données
                    await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            streamingEpisodes: formattedEpisodes,
                        }),
                    });

                    // Mets à jour localement
                    setAnime((prev) =>
                        prev
                            ? { ...prev, streamingEpisodes: formattedEpisodes }
                            : prev
                    );

                    // Mettre à jour l'état local des épisodes
                    setStreamingEpisodes(formattedEpisodes);
                }
            } catch (error) {
                console.error('Failed to fetch streaming episodes:', error);
            }
        };

        fetchStreamingEpisodes();
    }, [animeId, anime, setAnime, activeTab]);

    return streamingEpisodes;
};

export default useStreamingEpisodes;
