// useAnimeRelations.ts
import { useEffect, useState } from 'react';

interface AnimeRelation {
    id: number;
    title: {
        romaji: string;
        english?: string;
    };
    image: string;
    type: string;
    relationType: string;
}

const useAnimeRelations = (animeId: number | undefined, activeTab: string) => {
    const [relations, setRelations] = useState<AnimeRelation[] | null>(null);

    useEffect(() => {
        if (animeId === undefined) {
            return; // Ne pas exécuter si animeId est undefined
        }

        const fetchAnimeRelations = async () => {
            if (!animeId || activeTab !== 'relations') return;
            const query = `
            query ($id: Int) {
                Media(id: $id) {
                    relations {
                        edges {
                            node {
                                id
                                title {
                                    romaji
                                    english
                                }
                                type
                                coverImage {
                                    large
                                }
                            }
                        }
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
                const relations =
                    data?.Media?.relations?.edges.map((edge: any) => ({
                        id: edge.node.id,
                        title:
                            edge.node.title.english || edge.node.title.romaji,
                        type: edge.node.type,
                        image: edge.node.coverImage?.large,
                    })) || [];
                setRelations(relations);
            } catch (error) {
                console.error('Failed to fetch anime relations:', error);
            }
        };

        fetchAnimeRelations();
    }, [animeId, activeTab]);

    return relations;
};

export default useAnimeRelations;
