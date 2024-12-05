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

const useAnimeReviews = (animeId: number | undefined, activeTab: string) => {
    const [reviews, setReviews] = useState<Review[] | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!animeId || activeTab !== 'reviews') return;

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
                    setReviews(fetchedReviews);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchReviews();
    }, [animeId, activeTab]);

    return reviews;
};

export default useAnimeReviews;
