'use client';

import useAnimeCharacters from '@/app/hooks/useAnimeCharacters';
import useAnimeRelations from '@/app/hooks/useAnimeRelations';
import useAnimeReviews from '@/app/hooks/useAnimeReviews';
import useAnimeStaff from '@/app/hooks/useAnimeStaff';
import useAnimeTrailer from '@/app/hooks/useAnimeTrailer';
import useStreamingEpisodes from '@/app/hooks/useStreamingEpisodes';
import AddReviewModal from '@/components/AddReviewModal';
import AnimeDescription from '@/components/AnimeDescription';
import AnimeDetails from '@/components/AnimeDetails';
import AnimeInfo from '@/components/AnimeInfo';
import ErrorModal from '@/components/ErrorModal';
import ItemGrid from '@/components/ItemGrid';
import ReviewItem from '@/components/ReviewItem';
import TabsSection from '@/components/TabsSection';
import TrailerModal from '@/components/TrailerModal';
import { Anime } from '@/types';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/react';
import { ObjectId } from 'mongoose';
import { useEffect, useState } from 'react';

interface AnimeDetailParams {
    params: {
        id: ObjectId;
    };
}

const AnimeDetailsPage = ({ params }: AnimeDetailParams) => {
    const { id } = params;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [anime, setAnime] = useState<Anime | null>(null);
    const { trailerUrl, errorModal, setErrorModal, fetchTrailer } =
        useAnimeTrailer(anime, onOpen, setAnime);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const streamingEpisodes = useStreamingEpisodes(
        anime?.anime_id,
        anime,
        setAnime,
        activeTab
    );
    const relations = useAnimeRelations(
        anime?.anime_id,
        anime,
        setAnime,
        activeTab
    );
    const characters = useAnimeCharacters(
        anime?.anime_id,
        anime,
        setAnime,
        activeTab
    );
    const staff = useAnimeStaff(anime?.anime_id, anime, setAnime, activeTab);
    const reviews = useAnimeReviews(
        anime?.anime_id,
        anime,
        setAnime,
        activeTab
    );
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

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
        fetchTrailer();
    };

    const handleSaveReview = async (review: string) => {
        if (!anime) return;

        const userName = 'John Doe'; // Remplacer par le nom de l'utilisateur connecté
        const avatar = 'https://example.com/avatar.jpg'; // Remplacer par l'URL de l'avatar de l'utilisateur
        const score = 8; // Exemple de score, vous pouvez ajouter un champ pour cela dans le modal
        const summary = 'Great anime!'; // Ajouter un résumé de la critique
        const body = review; // Le corps de la critique
        console.log('Saving review:', review);
        const response = await fetch('/api/animes/reviews/addNewReview  ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                animeId: anime.anime_id,
                userName,
                avatar,
                score,
                summary,
                body,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Review added successfully', data);
            setIsReviewModalOpen(false); // Fermer le modal
        } else {
            console.error('Failed to add review', data);
        }
    };

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
                        type="episode"
                        loading={!streamingEpisodes}
                        items={streamingEpisodes}
                        getId={(episode) => episode.url} // Utilise l'URL comme ID unique
                        getName={(episode) => episode.title}
                        getImage={(episode) =>
                            episode.thumbnail ||
                            '/default-episode-thumbnail.jpg'
                        }
                    />
                ) : (
                    <p>Loading streaming episodes...</p>
                );
            case 'relations':
                return relations ? (
                    <ItemGrid
                        key="relations"
                        type="animev2"
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
                        type="character"
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
                        type="staff"
                        loading={!staff}
                        items={staff}
                        getId={(staffMember) => staffMember.id}
                        getName={(staffMember) => staffMember.name.full}
                        getImage={(staffMember) => staffMember.image.large}
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
                                onClick={() => setIsReviewModalOpen(true)}
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
                        animeId={anime._id}
                        onTrailerClick={handleTrailerClick}
                    />
                    <TabsSection onTabChange={(key) => setActiveTab(key)} />
                    {renderContent()}
                    <TrailerModal
                        isOpen={isOpen}
                        onClose={onClose}
                        trailerUrl={trailerUrl}
                    />
                    <ErrorModal
                        isOpen={errorModal.isOpen}
                        onClose={() =>
                            setErrorModal({ isOpen: false, message: '' })
                        }
                        errorMessage={errorModal.message}
                    />
                    <AddReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        onSave={handleSaveReview}
                    />
                </>
            )}
        </section>
    );
};

export default AnimeDetailsPage;
