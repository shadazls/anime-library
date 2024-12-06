import { Anime } from '@/types';
import { useEffect, useState } from 'react';

interface Review {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    score: number;
    summary: string;
    body: string;
}

const useAnimeReviews = (
    animeId: number | undefined,
    anime: Anime | null,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>,
    activeTab: string
) => {
    const [reviews, setReviews] = useState<Review[] | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!animeId || activeTab !== 'reviews') {
                return;
            }

            // Vérifie si les critiques sont déjà présentes dans l'objet anime
            if (anime && anime.reviews && anime.reviews.length > 0) {
                setReviews(anime.reviews);
                return;
            }

            const query = `
                query ($id: Int) {
                    Media(id: $id) {
                        reviews {
                            nodes {
                                id
                                user {
                                    name
                                    avatar {
                                        large
                                    }
                                }
                                score
                                summary
                                body
                            }
                        }
                    }
                }
            `;
            const variables = { id: animeId };

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const { data } = await response.json();

                if (data?.Media?.reviews?.nodes) {
                    const fetchedReviews = data.Media.reviews.nodes.map(
                        (node: any) => ({
                            id: node.id,
                            user: {
                                name: node.user.name,
                                avatar: node.user.avatar.large,
                            },
                            score: node.score,
                            summary: node.summary,
                            body: node.body,
                        })
                    );

                    // Ajouter les critiques à la base de données
                    if (anime) {
                        await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                reviews: fetchedReviews,
                            }),
                        });

                        // Mets à jour localement
                        setAnime((prev) =>
                            prev ? { ...prev, reviews: fetchedReviews } : prev
                        );
                    }

                    // Mettre à jour l'état local des critiques
                    setReviews(fetchedReviews);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchReviews();
    }, [animeId, activeTab, anime, setAnime]);

    return reviews;
};

export default useAnimeReviews;
