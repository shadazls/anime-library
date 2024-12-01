"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import Link from 'next/link';
import ItemGrid from "@/components/ItemGrid";
import { title } from "process";
import { ObjectId } from "mongoose";

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

  const animeCategories = [
    { title: "Trending Now", items: topAnimes },
    { title: "Popular this season", items: popularAnimes },
    { title: "Top Rated Animes", items: scoredAnimes },
    { title: "Action Animes", items: actionAnimes },
    { title: "Animes Movies", items: movieAnimes },
    { title: "Animes in 12 episodes", items: episodesAnimes },
    { title: "Anime released in 2000", items: premieredAnimes },
    { title: "Anime that has finished airing", items: statusAnimes },
    { title: "Anime produced by Shueisha", items: producerAnimes },
    { title: "Anime distributed by AnimEigo", items: licensorAnimes },
    { title: "Anime dessinated by Madhouse", items: studioAnimes },
    { title: "Anime that comes from a Manga", items: sourceAnimes },
    { title: "Anime with episodes of 27 minutes", items: durationAnimes },
    { title: "Anime prohibited for under 13s", items: ratingAnimes },
    { title: "All Time Popular", items: allTimePopularAnimes }
  ];

  const mangaCategories = [
    { title: "Best Ranked Mangas", items: rankedMangas },
    { title: "Most Popular Mangas", items: popularMangas },
    { title: "NSFW Mangas", items: nsfwMangas },
    { title : "Mangas that has finished airing", items: statusMangas },
    { title : "Mangas that has more than 50 volumes", items: volumesMangas },
    { title : "Mangas writed by Shunsaku Tomose", items: authorMangas },
    { title : "Mangas that comes from light novel", items: mediaTypeMangas },
    { title : "Mangas that has started in 1989", items: startDateMangas },
    { title : "Mangas that has more than 500 chapters", items: chaptersMangas }
  ];

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
