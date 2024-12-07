'use client';

import ItemGrid from '@/components/ItemGrid';
import { Button } from '@nextui-org/button';
import { Tab, Tabs } from '@nextui-org/tabs';
import { ObjectId } from 'mongoose';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Définir une interface pour représenter un anime
interface Anime {
    _id: ObjectId;
    Name: string;
    image_url: string;
}

// Définir une interface pour représenter un manga
interface Manga {
    _id: ObjectId;
    title: string;
    main_picture: {
        medium: string;
    };
}

export default function Home() {
    const [topAnimes, setTopAnimes] = useState<Anime[]>([]); // Animes par rank
    const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]); // Animes par popularité
    const [allTimePopularAnimes, setAllTimePopularAnimes] = useState<Anime[]>(
        []
    ); // Animes populaires de tous les temps
    const [scoredAnimes, setScoredAnimes] = useState<Anime[]>([]);
    const [actionAnimes, setActionAnimes] = useState<Anime[]>([]);
    const [movieAnimes, setMovieAnimes] = useState<Anime[]>([]);
    const [episodesAnimes, setEpisodesAnimes] = useState<Anime[]>([]);
    const [premieredAnimes, setPremieredAnimes] = useState<Anime[]>([]);
    const [statusAnimes, setStatusAnimes] = useState<Anime[]>([]);
    const [producerAnimes, setProducerAnimes] = useState<Anime[]>([]);
    const [licensorAnimes, setLicensorAnimes] = useState<Anime[]>([]);
    const [studioAnimes, setStudioAnimes] = useState<Anime[]>([]);
    const [sourceAnimes, setSourceAnimes] = useState<Anime[]>([]);
    const [durationAnimes, setDurationAnimes] = useState<Anime[]>([]);
    const [ratingAnimes, setRatingAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [selectedTab, setSelectedTab] = useState<string>('anime'); // État pour le tab sélectionné
    const [rankedMangas, setRankedMangas] = useState<Manga[]>([]);
    const [nsfwMangas, setNsfwMangas] = useState<Manga[]>([]);
    const [popularMangas, setPopularMangas] = useState<Manga[]>([]);
    const [startDateMangas, setStartDateMangas] = useState<Manga[]>([]);
    const [mediaTypeMangas, setMediaTypeMangas] = useState<Manga[]>([]);
    const [statusMangas, setStatusMangas] = useState<Manga[]>([]);
    const [volumesMangas, setVolumesMangas] = useState<Manga[]>([]);
    const [authorMangas, setAuthorMangas] = useState<Manga[]>([]);
    const [chaptersMangas, setChaptersMangas] = useState<Manga[]>([]);

    // Fonction pour gérer le changement de tab
    const handleTabChange = (key: React.Key) => {
        const tabKey = key as string; // Convertir React.Key en string
        setSelectedTab(tabKey);
    };

    const fetchData = async (url: string, cacheKey: string) => {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}`);
            }
            const data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(data)); // Mise en cache
            return data;
        }
    };

    // Fonction de récupération des animes
    useEffect(() => {
        document.body.style.background =
            'url(/bgChainsawman.jpg) no-repeat center top, #121212';
        // document.body.classList.add("background-main")#121212
        const fetchAnimes = async () => {
            try {
                setLoading(true);
                const [
                    rankData,
                    popularityData,
                    allTimeData,
                    scoreData,
                    actionData,
                    movieData,
                    episodesData,
                    premieredData,
                    statusData,
                    producerData,
                    licensorData,
                    studioData,
                    sourceData,
                    durationData,
                    ratingData,
                ] = await Promise.all([
                    fetchData('/api/animes/ranked', 'rankData'),
                    fetchData('/api/animes/popularity', 'popularityData'),
                    fetchData('/api/animes/favorites', 'allTimeData'),
                    fetchData('/api/animes/score', 'scoreData'),
                    fetchData(
                        '/api/animes/animesByGenre?genre=Action',
                        'actionData'
                    ),
                    fetchData(
                        '/api/animes/animesByType?type=Movie',
                        'movieData'
                    ),
                    fetchData(
                        '/api/animes/animesByEpisodes?episodes=12',
                        'episodesData'
                    ),
                    fetchData(
                        '/api/animes/animesByPremiered?year=2000',
                        'premieredData'
                    ),
                    fetchData(
                        '/api/animes/animesByStatus?status=Finished Airing',
                        'statusData'
                    ),
                    fetchData(
                        '/api/animes/animesByProducer?producer=Shueisha',
                        'producerData'
                    ),
                    fetchData(
                        '/api/animes/animesByLicensor?licensor=AnimEigo',
                        'licensorData'
                    ),
                    fetchData(
                        '/api/animes/animesByStudio?studio=Madhouse',
                        'studioData'
                    ),
                    fetchData(
                        '/api/animes/animesBySource?source=Manga',
                        'sourceData'
                    ),
                    fetchData(
                        '/api/animes/animesByDuration?duration=27%20min%20per%20ep',
                        'durationData'
                    ),
                    fetchData(
                        '/api/animes/animesByRating?rating=PG-13%20-%20Teens%2013%20or%20older',
                        'ratingData'
                    ),
                ]);

                setTopAnimes(rankData);
                setPopularAnimes(popularityData);
                setAllTimePopularAnimes(allTimeData);
                setScoredAnimes(scoreData);
                setActionAnimes(actionData.animes);
                setMovieAnimes(movieData.animes);
                setEpisodesAnimes(episodesData.animes);
                setPremieredAnimes(premieredData.animes);
                setStatusAnimes(statusData.animes);
                setProducerAnimes(producerData.animes);
                setLicensorAnimes(licensorData.animes);
                setStudioAnimes(studioData.animes);
                setSourceAnimes(sourceData.animes);
                setDurationAnimes(durationData.animes);
                setRatingAnimes(ratingData.animes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMangas = async () => {
            try {
                setLoading(true);
                const [
                    rankData,
                    nsfwData,
                    popularityData,
                    startDateData,
                    mediaTypeData,
                    statusData,
                    volumesData,
                    authorData,
                    chaptersData,
                ] = await Promise.all([
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByRank',
                        'rankedMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByNSFW',
                        'nsfwMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByPopularity',
                        'popularMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByStartDate?year=1989',
                        'startDateMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByMediaType',
                        'mediaTypeMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByStatus',
                        'statusMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByVolumes',
                        'volumesMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByAuthor?author=Shunsaku%20Tomose',
                        'authorMangasData'
                    ),
                    fetchData(
                        'http://localhost:3000/api/mangas/mangasByChapters',
                        'chaptersMangasData'
                    ),
                ]);

                setRankedMangas(rankData.mangas);
                setNsfwMangas(nsfwData.mangas);
                setPopularMangas(popularityData.mangas);
                setStartDateMangas(startDateData.mangas);
                setMediaTypeMangas(mediaTypeData.mangas);
                setStatusMangas(statusData.mangas);
                setVolumesMangas(volumesData.mangas);
                setAuthorMangas(authorData.mangas);
                setChaptersMangas(chaptersData.mangas);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimes();
        fetchMangas();
    }, []);

    const animeCategories = [
        { title: 'Trending Now', items: topAnimes },
        { title: 'Popular this season', items: popularAnimes },
        { title: 'Top Rated Animes', items: scoredAnimes },
        { title: 'Action Animes', items: actionAnimes },
        { title: 'Animes Movies', items: movieAnimes },
        { title: 'Animes in 12 episodes', items: episodesAnimes },
        { title: 'Anime released in 2000', items: premieredAnimes },
        { title: 'Anime that has finished airing', items: statusAnimes },
        { title: 'Anime produced by Shueisha', items: producerAnimes },
        { title: 'Anime distributed by AnimEigo', items: licensorAnimes },
        { title: 'Anime dessinated by Madhouse', items: studioAnimes },
        { title: 'Anime that comes from a Manga', items: sourceAnimes },
        { title: 'Anime with episodes of 27 minutes', items: durationAnimes },
        { title: 'Anime prohibited for under 13s', items: ratingAnimes },
        { title: 'All Time Popular', items: allTimePopularAnimes },
    ];

    const mangaCategories = [
        { title: 'Best Ranked Mangas', items: rankedMangas },
        { title: 'Most Popular Mangas', items: popularMangas },
        { title: 'NSFW Mangas', items: nsfwMangas },
        { title: 'Mangas that has finished airing', items: statusMangas },
        { title: 'Mangas that has more than 50 volumes', items: volumesMangas },
        { title: 'Mangas writed by Shunsaku Tomose', items: authorMangas },
        { title: 'Mangas that comes from light novel', items: mediaTypeMangas },
        { title: 'Mangas that has started in 1989', items: startDateMangas },
        {
            title: 'Mangas that has more than 500 chapters',
            items: chaptersMangas,
        },
    ];

    return (
        <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
            <h1 className="text-6xl font-bold mt-48">Chainsaw Man</h1>
            <p className="text-xl w-1/4">
                Denji has a simple dream -- to live a happy and peaceful life,
                spending time with a girl
            </p>

            <Tabs
                aria-label="Options"
                onSelectionChange={handleTabChange}
                className="mt-32"
            >
                <Tab key="anime" title="Anime" />
                <Tab key="mangas" title="Manga" />
            </Tabs>

            {selectedTab === 'anime' ? (
                <>
                    {animeCategories.map((category, index) => (
                        <ItemGrid
                            key={index}
                            getId={(anime) => anime._id}
                            title={category.title}
                            loading={loading}
                            items={category.items}
                            getName={(anime) => anime.Name}
                            getImage={(anime) => anime.image_url}
                        />
                    ))}
                    <Link href="/animeCatalog">
                        <Button
                            className="mt-8 text-base font-medium text-black bg-white w-full"
                            variant="flat"
                            radius="sm"
                            size="lg"
                        >
                            Show More
                        </Button>
                    </Link>
                </>
            ) : (
                <>
                    {mangaCategories.map((category, index) => (
                        <ItemGrid
                            key={index}
                            getId={(manga) => manga._id}
                            title={category.title}
                            loading={loading}
                            items={category.items}
                            getName={(manga) => manga.title}
                            getImage={(manga) => manga.main_picture.medium}
                        />
                    ))}
                    <Link href="/mangaCatalog">
                        <Button
                            className="mt-8 text-base font-medium text-black bg-white w-full"
                            variant="flat"
                            radius="sm"
                            size="lg"
                        >
                            Show More
                        </Button>
                    </Link>
                </>
            )}
        </section>
    );
}
