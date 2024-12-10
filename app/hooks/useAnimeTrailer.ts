import { Anime } from '@/types';
import { useState } from 'react';

const useAnimeTrailer = (
    anime: Anime | null,
    onOpen: () => void,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>
) => {
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState({
        isOpen: false,
        message: '',
    });

    const fetchTrailer = async () => {
        if (!anime) return;

        // Si `trailer_url` existe déjà, utilise-le directement
        if (anime.trailer_url) {
            setTrailerUrl(anime.trailer_url);
            onOpen();
            return;
        }

        try {
            // Requête à AniList pour récupérer le trailer
            const query = `
                query ($search: String) {
                    Media(search: $search, type: ANIME) {
                        trailer {
                            id
                            site
                        }
                    }
                }
            `;
            const variables = { search: anime.Name };

            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const { data } = await response.json();

            if (data?.Media?.trailer?.site === 'youtube') {
                const fetchedTrailerUrl = `https://www.youtube.com/embed/${data.Media.trailer.id}`;

                // Mets à jour le trailer dans la base de données
                await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ trailer_url: fetchedTrailerUrl }),
                });

                // Mets à jour localement
                setAnime((prev) =>
                    prev ? { ...prev, trailer_url: fetchedTrailerUrl } : prev
                );
                setTrailerUrl(fetchedTrailerUrl);
                onOpen();
            } else {
                // Si le trailer n'est pas sur YouTube, rechercher sur l'API YouTube Data
                const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
                if (!YOUTUBE_API_KEY) {
                    console.error('YouTube API Key not set.');
                    setErrorModal({
                        isOpen: true,
                        message: 'YouTube API key is missing.',
                    });
                    return;
                }

                const searchQuery = `${anime.Name} Trailer`;
                const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    searchQuery
                )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`;

                const youtubeResponse = await fetch(youtubeApiUrl);
                const youtubeData = await youtubeResponse.json();

                if (youtubeData.items && youtubeData.items.length > 0) {
                    const videoId = youtubeData.items[0].id.videoId;
                    const fetchedTrailerUrl = `https://www.youtube.com/embed/${videoId}`;

                    // Mets à jour le trailer dans la base de données
                    await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            trailer_url: fetchedTrailerUrl,
                        }),
                    });

                    // Mets à jour localement
                    setAnime((prev) =>
                        prev
                            ? { ...prev, trailer_url: fetchedTrailerUrl }
                            : prev
                    );
                    setTrailerUrl(fetchedTrailerUrl);
                    onOpen();
                } else {
                    setErrorModal({
                        isOpen: true,
                        message: 'No trailers found on YouTube.',
                    });
                }
            }
        } catch (error) {
            setErrorModal({
                isOpen: true,
                message: 'Failed to fetch the trailer. Please try again later.',
            });
            console.error('Failed to fetch trailer:', error);
        }
    };

    return { trailerUrl, errorModal, fetchTrailer, setErrorModal };
};

export default useAnimeTrailer;
