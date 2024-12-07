'use client';

import AnimeDescription from '@/components/AnimeDescription';
import AnimeDetailsV2 from '@/components/AnimeDetailsV2';
import AnimeInfo from '@/components/AnimeInfo';
import ItemGrid from '@/components/ItemGrid';
import TabsSection from '@/components/TabsSection';
import { useEffect, useState } from 'react';

const AnimeDetailsPageV2 = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [anime, setAnime] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        document.body.style.background = '#121212';
        const fetchAnimeDetails = async () => {
            setLoading(true);
            const query = `
                query ($id: Int) {
                    Media(id: $id, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        type
                        episodes
                        genres
                        bannerImage
                        startDate {
                            year
                            month
                            day
                        }
                        status
                        season
                        seasonYear
                        studios {
                            nodes {
                                name
                            }
                        }
                        source
                        duration
                        averageScore
                        popularity
                        favourites
                        description
                        characters(sort: FAVOURITES_DESC) {
                            edges {
                                node {
                                    id
                                    name {
                                        full
                                    }
                                    image {
                                        large
                                    }
                                }
                            }
                        }
                        relations {
                            edges {
                                node {
                                    id
                                    title {
                                        romaji
                                    }
                                    coverImage {
                                        large
                                    }
                                }
                            }
                        }
                        trailer {
                            id
                            site
                        }
                        coverImage {
                            large
                        }
                    }
                }
            `;
            const variables = { id: parseInt(id, 10) };

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, variables }),
                });
                const { data } = await response.json();
                setAnime(data.Media);
                // Mise à jour du fond d'écran avec l'image banner
                document.body.style.background = data.Media.bannerImage
                    ? `url(${data.Media.bannerImage}) no-repeat center top, #121212`
                    : '#121212';
            } catch (error) {
                console.error('Error fetching anime details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeDetails();
    }, [id]);

    const renderContent = () => {
        if (loading) return <p>Loading...</p>;

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="flex">
                        <AnimeDetailsV2
                            anime={{
                                Type: anime.type,
                                Episodes: anime.episodes,
                                Genres: anime.genres,
                                Aired: `${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}`,
                                Status: anime.status,
                                Season: anime.season,
                                Premiered: `${anime.season} ${anime.seasonYear}`,
                                Studios: anime.studios.nodes.map(
                                    (node: any) => node.name
                                ),
                                Source: anime.source,
                                Duration: `${anime.duration} min`,
                                'Average Score': `${anime.averageScore}/100`,
                                Popularity: anime.popularity,
                                Favorites: anime.favourites,
                            }}
                        />
                        <AnimeDescription
                            synopsis={
                                anime.description || 'No description available'
                            }
                        />
                    </div>
                );
            case 'relations':
                return (
                    <ItemGrid
                        key="relations"
                        type="animev2"
                        title="Relations"
                        loading={loading}
                        items={anime.relations.edges.map(
                            (edge: any) => edge.node
                        )}
                        getId={(relation) => relation.id}
                        getName={(relation) => relation.title.romaji}
                        getImage={(relation) => relation.coverImage.large}
                    />
                );
            case 'characters':
                return (
                    <ItemGrid
                        key="characters"
                        type="character"
                        title="Characters"
                        loading={loading}
                        items={anime.characters.edges.map(
                            (edge: any) => edge.node
                        )}
                        getId={(character) => character.id}
                        getName={(character) => character.name.full}
                        getImage={(character) => character.image.large}
                    />
                );
            default:
                return <p>Content not available</p>;
        }
    };

    return (
        <section className="p-4 mx-24">
            {!loading && anime && (
                <>
                    <AnimeInfo
                        animeName={anime.title.romaji}
                        animeScore={anime.averageScore}
                        animeImageUrl={anime.coverImage.large}
                        onTrailerClick={() => {
                            if (anime.trailer?.site === 'youtube') {
                                window.open(
                                    `https://www.youtube.com/watch?v=${anime.trailer.id}`,
                                    '_blank'
                                );
                            } else {
                                alert('Trailer not available');
                            }
                        }}
                    />
                    <TabsSection onTabChange={(key) => setActiveTab(key)} />
                    {renderContent()}
                </>
            )}
        </section>
    );
};

export default AnimeDetailsPageV2;
