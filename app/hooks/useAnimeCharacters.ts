// useAnimeCharacters.ts
import { ObjectId } from 'mongoose';
import { useEffect, useState } from 'react';

interface Character {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: {
        large: string;
        medium?: string;
    };
    role: string;
}

interface Anime {
    _id: ObjectId;
    anime_id: number;
    Name: string;
    Score: number;
    Genres: string[];
    Synopsis: string;
    Type: string;
    Episodes: number;
    Aired: string;
    Premiered: string;
    Status: string;
    Producers: string[];
    Licensors: string[];
    Studios: string[];
    Source: string;
    Duration: string;
    Rating: string;
    Rank: number;
    Popularity: number;
    Favorites: number;
    Members: number;
    image_url: string;
    trailer_url?: string;
    characters?: Character[];
}

const useAnimeCharacters = (
    animeId: number | undefined,
    anime: Anime | null,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>,
    activeTab: string
) => {
    const [characters, setCharacters] = useState<Character[] | null>(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            if (!animeId || !anime) return;

            // Vérifie si les personnages sont déjà présents dans l'objet anime
            if (anime.characters && anime.characters.length > 0) {
                setCharacters(anime.characters);
                return;
            }

            const query = `
            query ($id: Int) {
                Media(id: $id) {
                    characters {
                        edges {
                            role
                            node {
                                id
                                name {
                                    full
                                    native
                                }
                                image {
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
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const { data } = await response.json();

                if (data?.Media?.characters?.edges) {
                    const formattedCharacters = data.Media.characters.edges.map(
                        (edge: any) => ({
                            id: edge.node.id,
                            name: edge.node.name,
                            image: edge.node.image,
                            role: edge.role,
                        })
                    );

                    // Ajouter les personnages à la base de données
                    await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            characters: formattedCharacters,
                        }),
                    });

                    // Mets à jour localement
                    setAnime((prev) =>
                        prev
                            ? { ...prev, characters: formattedCharacters }
                            : prev
                    );

                    // Mettre à jour l'état local des personnages
                    setCharacters(formattedCharacters);
                }
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            }
        };

        fetchCharacters();
    }, [animeId, anime, setAnime, activeTab]);

    return characters;
};

export default useAnimeCharacters;
