'use client';

import AnimeDescription from '@/components/AnimeDescription';
import AnimeDetails from '@/components/AnimeDetails';
import AnimeInfo from '@/components/AnimeInfo';
import ItemGrid from '@/components/ItemGrid';
import TabsSection from '@/components/TabsSection';
import TrailerModal from '@/components/TrailerModal';
import { useDisclosure } from '@nextui-org/react';
import { ObjectId } from 'mongoose';
import { useEffect, useState } from 'react';

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

interface AnimeDetailParams {
    params: {
        id: string;
    };
}

interface Relation {
    id: number;
    title: {
        romaji: string;
        english?: string;
    };
    image: string;
    type: string;
    relationType: string;
}

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

interface Staff {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: string;
    role: string;
}

const AnimeDetailsPage = ({ params }: AnimeDetailParams) => {
    const { id } = params;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [relations, setRelations] = useState<Relation[] | null>(null);
    const [characters, setCharacters] = useState<Character[] | null>(null);
    const [staff, setStaff] = useState<Staff[] | null>(null);

    useEffect(() => {
        document.body.style.background = '#121212'; // Fond sombre
        if (!id) return;
        const fetchAnimeDetails = async () => {
            try {
                const response = await fetch(`/api/animes/anime?id=${id}`);
                if (!response.ok)
                    throw new Error('Failed to fetch anime details');
                const data = await response.json();
                setAnime(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAnimeDetails();
    }, [id]);

    const fetchRelations = async () => {
        if (!anime) return;

        try {
            const query = `
        query ($search: String) {
          Media(search: $search, type: ANIME) {
            relations {
              edges {
                relationType
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
            const variables = { search: anime.Name };

            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const { data } = await response.json();

            const fetchedRelations = data?.Media?.relations?.edges.map(
                (edge: any) => ({
                    id: edge.node.id,
                    title: edge.node.title,
                    image: edge.node.coverImage.large,
                    type: edge.node.type,
                    relationType: edge.relationType,
                })
            );

            setRelations(fetchedRelations || []);
        } catch (error) {
            console.error('Failed to fetch relations:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'relations') {
            fetchRelations();
        }
    }, [activeTab]);

    const fetchCharacters = async () => {
        console.log('HAHAHAHAHAAHHAHAHAHAHAHAHHAHAHHAHAHAHAHAHAHAHH');
        if (!anime) return;

        if (anime.characters && anime.characters.length > 0) {
            console.log('ANIME CHARACTERShihi', anime.characters);
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
        const variables = { id: anime.anime_id };
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

                // Ajout de la validation ici
                const validateCharacters = (characters: any[]) => {
                    return characters.every(
                        (char) =>
                            typeof char.id === 'number' &&
                            typeof char.name?.full === 'string' &&
                            typeof char.image?.large === 'string' &&
                            typeof char.role === 'string'
                    );
                };

                // Ajouter les personnages à la base de données
                await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ characters: formattedCharacters }),
                });
                // Mets à jour localement
                setAnime((prev) =>
                    prev ? { ...prev, characters: formattedCharacters } : prev
                );
                if (anime.characters && Array.isArray(anime.characters)) {
                    setCharacters(anime.characters);
                }
                // setCharacters(formattedCharacters);
            }
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        }
    };

    // Appeler `fetchCharacters` lorsque l'onglet est activé
    useEffect(() => {
        if (activeTab === 'characters') {
            fetchCharacters();
        }
    }, [activeTab]);

    const handleTrailerClick = async () => {
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
                alert('Trailer not available');
            }
        } catch (error) {
            console.error('Failed to fetch trailer:', error);
        }
    };

    const fetchStaff = async (animeId: number) => {
        const query = `
          query ($id: Int) {
            Media(id: $id) {
              staff {
                edges {
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

            if (data?.Media?.staff?.edges) {
                const staff = data.Media.staff.edges.map((edge: any) => ({
                    id: edge.node.id,
                    name: edge.node.name,
                    image: edge.node.image?.large,
                    role: edge.role,
                }));

                setStaff(staff);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'staff') {
            if (anime) {
                fetchStaff(anime.anime_id);
            }
        }
    }, [activeTab, anime]);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="flex">
                        <AnimeDetails anime={anime!} />
                        <AnimeDescription synopsis={anime!.Synopsis} />
                    </div>
                );
            case 'relations':
                return relations ? (
                    <ItemGrid
                        key="relations"
                        loading={!relations}
                        items={relations}
                        getId={(relation) => relation.id}
                        getName={(relation) => relation.title.romaji}
                        getImage={(relation) => relation.image}
                    />
                ) : (
                    <p>Loading relations...</p>
                );
            case 'characters':
                return (
                    <ItemGrid
                        key="characters"
                        loading={!characters}
                        items={characters || []}
                        getId={(character) => character.id}
                        getName={(character) => character.name.full}
                        getImage={(character) => character.image.large}
                    />
                );
            case 'staff':
                return staff ? (
                    <ItemGrid
                        key="staff"
                        loading={!staff}
                        items={staff}
                        getId={(staffMember) => staffMember.id}
                        getName={(staffMember) => staffMember.name.full}
                        getImage={(staffMember) => staffMember.image}
                    />
                ) : (
                    <p>Loading staff...</p>
                );
            case 'reviews':
                return <p>Reviews</p>;
            default:
                return null;
        }
    };

    return (
        <section className="p-4 mx-24">
            {anime && (
                <>
                    <AnimeInfo
                        animeName={anime.Name}
                        animeScore={anime.Score}
                        animeImageUrl={anime.image_url}
                        onTrailerClick={handleTrailerClick}
                    />
                    <TabsSection onTabChange={(key) => setActiveTab(key)} />
                    {renderContent()}
                    <TrailerModal
                        isOpen={isOpen}
                        onClose={onClose}
                        trailerUrl={trailerUrl}
                    />
                </>
            )}
        </section>
    );
};

export default AnimeDetailsPage;
