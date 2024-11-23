"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import Link from 'next/link';
import ItemGrid from "@/components/ItemGrid";

// Définir une interface pour représenter un anime
interface Anime {
  Name: string;
  image_url: string;
}

// Définir une interface pour représenter un manga
interface Manga {
  title: string;
  main_picture: {
    medium: string;
  };
}

export default function Home() {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]); // Animes par rank
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]); // Animes par popularité
  const [allTimePopularAnimes, setAllTimePopularAnimes] = useState<Anime[]>([]); // Animes populaires de tous les temps
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
  const [selectedTab, setSelectedTab] = useState<string>("anime"); // État pour le tab sélectionné
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

  // Fonction de récupération des animes
  useEffect(() => {
    document.body.style.background = 'url(/bgChainsawman.jpg) no-repeat center top, #121212';
    // document.body.classList.add("background-main")#121212
    const fetchAnimes = async () => {
      try {
        const [rankResponse, popularityResponse, allTimeResponse, scoreResponse, actionResponse, movieResponse, episodesResponse, premieredResponse, statusReponse, producerResponse, licensorResponse, studioResponse, sourceResponse, durationResponse, ratingResponse] = await Promise.all([
          fetch("/api/animes/ranked"),
          fetch("/api/animes/popularity"),
          fetch("/api/animes/favorites"),
          fetch("/api/animes/score"),
          fetch("/api/animes/animesByGenre?genre=Action"),
          fetch("/api/animes/animesByType?type=Movie"),
          fetch("/api/animes/animesByEpisodes?episodes=12"),
          fetch("/api/animes/animesByPremiered?year=2000"),
          fetch("/api/animes/animesByStatus?status=Finished Airing"),
          fetch("/api/animes/animesByProducer?producer=Shueisha"),
          fetch("/api/animes/animesByLicensor?licensor=AnimEigo"),
          fetch("/api/animes/animesByStudio?studio=Madhouse"),
          fetch("/api/animes/animesBySource?source=Manga"),
          fetch("/api/animes/animesByDuration?duration=27%20min%20per%20ep"),
          fetch("/api/animes/animesByRating?rating=PG-13%20-%20Teens%2013%20or%20older")
        ]);

        if (
          !rankResponse.ok ||
          !popularityResponse.ok ||
          !allTimeResponse.ok ||
          !scoreResponse.ok ||
          !actionResponse.ok ||
          !movieResponse.ok ||
          !episodesResponse.ok ||
          !premieredResponse.ok ||
          !statusReponse.ok ||
          !producerResponse.ok ||
          !licensorResponse.ok ||
          !studioResponse.ok ||
          !sourceResponse.ok ||
          !durationResponse.ok ||
          !ratingResponse.ok
        ) {
          throw new Error("Failed to fetch animes");
        }

        const rankData = await rankResponse.json();
        const popularityData = await popularityResponse.json();
        const allTimeData = await allTimeResponse.json();
        const scoreData = await scoreResponse.json();
        const actionData = await actionResponse.json();
        const movieData = await movieResponse.json();
        const episodesData = await episodesResponse.json();
        const premieredData = await premieredResponse.json();
        const statusData = await statusReponse.json();
        const producerData = await producerResponse.json();
        const licensorData = await licensorResponse.json();
        const studioData = await studioResponse.json();
        const sourceData = await sourceResponse.json();
        const durationData = await durationResponse.json();
        const ratingData = await ratingResponse.json();

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
        const [rankResponse, nsfwResponse, popularityResponse, startDateResponse, mediaTypeResponse, statusResponse, volumesResponse, authorResponse, chaptersResponse] = await Promise.all([
          fetch("http://localhost:3000/api/mangas/mangasByRank"),
          fetch("http://localhost:3000/api/mangas/mangasByNSFW"),
          fetch("http://localhost:3000/api/mangas/mangasByPopularity"),
          fetch("http://localhost:3000/api/mangas/mangasByStartDate?year=1989"),
          fetch("http://localhost:3000/api/mangas/mangasByMediaType"),
          fetch("http://localhost:3000/api/mangas/mangasByStatus"),
          fetch("http://localhost:3000/api/mangas/mangasByVolumes"),
          fetch("http://localhost:3000/api/mangas/mangasByAuthor?author=Shunsaku%20Tomose"),
          fetch("http://localhost:3000/api/mangas/mangasByChapters")
        ]);
  
        if (
          !rankResponse.ok ||
          !nsfwResponse.ok ||
          !popularityResponse.ok ||
          !startDateResponse.ok ||
          !mediaTypeResponse.ok ||
          !statusResponse.ok ||
          !volumesResponse.ok ||
          !authorResponse.ok ||
          !chaptersResponse.ok
        ) {
          throw new Error("Failed to fetch mangas");
        }
  
        const rankData = await rankResponse.json();
        const nsfwData = await nsfwResponse.json();
        const popularityData = await popularityResponse.json();
        const startDateData = await startDateResponse.json();
        const mediaTypeData = await mediaTypeResponse.json();
        const statusData = await statusResponse.json();
        const volumesData = await volumesResponse.json();
        const authorData = await authorResponse.json();
        const chaptersData = await chaptersResponse.json();
  
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

  }, [selectedTab]);

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">

      <h1 className="text-6xl font-bold mt-48">Chainsaw Man</h1>
      <p className="text-xl w-1/4">Denji has a simple dream -- to live a happy and peaceful life, spending time with a girl</p>

      <Tabs aria-label="Options" onSelectionChange={handleTabChange} className="mt-32">
        <Tab key="anime" title="Anime" />
        <Tab key="mangas" title="Manga" />
      </Tabs>

      {selectedTab === "anime" ? (
        <>
          <ItemGrid
            title="Trending Now"
            loading={loading}
            items={topAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Popular this season"
            loading={loading}
            items={popularAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Top Rated Animes"
            loading={loading}
            items={scoredAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Action Animes"
            loading={loading}
            items={actionAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Animes Movies"
            loading={loading}
            items={movieAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Animes in 12 episodes"
            loading={loading}
            items={episodesAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime released in 2000"
            loading={loading}
            items={premieredAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime that has finished airing"
            loading={loading}
            items={statusAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime produced by Shueisha"
            loading={loading}
            items={producerAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime distributed by AnimEigo"
            loading={loading}
            items={licensorAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime dessinated by Madhouse"
            loading={loading}
            items={studioAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime that comes from a Manga"
            loading={loading}
            items={sourceAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime with episodes of 27 minutes"
            loading={loading}
            items={durationAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="Anime prohibited for under 13s"
            loading={loading}
            items={ratingAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
          <ItemGrid
            title="All Time Popular"
            loading={loading}
            items={allTimePopularAnimes}
            getName={(anime) => anime.Name}
            getImage={(anime) => anime.image_url}
          />
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
          <ItemGrid
            title="Best Ranked Mangas"
            loading={loading}
            items={rankedMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Most Popular Mangas"
            loading={loading}
            items={popularMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="NSFW Mangas"
            loading={loading}
            items={nsfwMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas that has finished airing"
            loading={loading}
            items={statusMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas that has more than XXX volumes"
            loading={loading}
            items={volumesMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas writed by"
            loading={loading}
            items={authorMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas by mediatype XXX"
            loading={loading}
            items={mediaTypeMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas that has started in XXX year"
            loading={loading}
            items={startDateMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
          <ItemGrid
            title="Mangas that has XXX chapters"
            loading={loading}
            items={chaptersMangas}
            getName={(manga) => manga.title}
            getImage={(manga) => manga.main_picture.medium}
          />
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
