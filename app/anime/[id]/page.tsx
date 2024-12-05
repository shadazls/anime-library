'use client';

import useAnimeCharacters from '@/app/hooks/useAnimeCharacters';
import useAnimeRelations from '@/app/hooks/useAnimeRelations';
import useStreamingEpisodes from '@/app/hooks/useStreamingEpisodes';
import AnimeDescription from '@/components/AnimeDescription';
import AnimeDetails from '@/components/AnimeDetails';
import AnimeInfo from '@/components/AnimeInfo';
import ItemGrid from '@/components/ItemGrid';
import ReviewItem from '@/components/ReviewItem';
import TabsSection from '@/components/TabsSection';
import TrailerModal from '@/components/TrailerModal';
import { Button } from '@nextui-org/button';
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

const AnimeDetailsPage = ({ params }: AnimeDetailParams) => {
    const { id } = params;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [staff, setStaff] = useState<Staff[] | null>(null);
    const [reviews, setReviews] = useState<Review[] | null>(null);
    const streamingEpisodes = useStreamingEpisodes(anime?.anime_id);
    const relations = useAnimeRelations(anime?.anime_id);
    const characters = useAnimeCharacters(anime?.anime_id, anime, setAnime);

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

    const fetchReviews = async (animeId: number) => {
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

    useEffect(() => {
        if (activeTab === 'reviews') {
            if (anime) {
                fetchReviews(anime.anime_id);
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
            case 'watch':
                return streamingEpisodes ? (
                    <ItemGrid
                        key="streamingEpisodes"
                        loading={!streamingEpisodes}
                        items={streamingEpisodes}
                        getId={(episode) => episode.url} // Utilise l'URL comme ID unique
                        getName={(episode) => episode.title}
                        getImage={(episode) =>
                            episode.thumbnail ||
                            '/default-episode-thumbnail.jpg'
                        } // Image par défaut si aucune vignette
                        // getExtra={(episode) => (
                        //     <div>
                        //         <a
                        //             href={episode.url}
                        //             target="_blank"
                        //             rel="noopener noreferrer"
                        //             className="block text-sm text-blue-500"
                        //         >
                        //             {episode.site}
                        //         </a>
                        //     </div>
                        // )}
                    />
                ) : (
                    <p>Loading streaming episodes...</p>
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
                return reviews ? (
                    <>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Recent Reviews
                            </h3>
                            <Button
                                className="text-lg mb-8 font-medium text-black bg-white w-96"
                                variant="flat"
                                radius="sm"
                                size="lg"
                            >
                                Write a review
                            </Button>
                            {reviews.map((review) => (
                                <ReviewItem key={review.id} review={review} />
                            ))}
                        </div>
                    </>
                ) : (
                    <p>Loading reviews...</p>
                );
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
