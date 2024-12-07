import { Anime, AnimeRelation } from '@/types';
import { useEffect, useState } from 'react';

const useAnimeRelations = (
    animeId: number | undefined,
    anime: Anime | null,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>,
    activeTab: string
) => {
    const [relations, setRelations] = useState<AnimeRelation[] | null>(null);

    useEffect(() => {
        const fetchRelations = async () => {
            if (!animeId || !anime || activeTab !== 'relations') return;

            // Vérifier si les relations sont déjà présentes dans l'objet anime
            if (anime.relations && anime.relations.length > 0) {
                setRelations(anime.relations);
                return;
            }

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
                            relationType
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

                if (data?.Media?.relations?.edges) {
                    const formattedRelations = data.Media.relations.edges.map(
                        (edge: any) => ({
                            id: edge.node.id,
                            title: {
                                romaji: edge.node.title.romaji,
                                english: edge.node.title.english,
                            },
                            image: edge.node.coverImage.large,
                            type: edge.node.type,
                            relationType: edge.relationType,
                        })
                    );

                    // Ajouter les relations à la base de données
                    await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            relations: formattedRelations,
                        }),
                    });

                    // Mettre à jour localement l'objet anime
                    setAnime((prev) =>
                        prev ? { ...prev, relations: formattedRelations } : prev
                    );

                    // Mettre à jour l'état local des relations
                    setRelations(formattedRelations);
                }
            } catch (error) {
                console.error('Failed to fetch anime relations:', error);
            }
        };

        fetchRelations();
    }, [animeId, anime, setAnime, activeTab]);

    return relations;
};

export default useAnimeRelations;
