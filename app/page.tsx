"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { set } from "mongoose";
import Link from 'next/link';
import TrashIcon from "@/components/TrashIcon";

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
    switch (tabKey) {
      case "anime":
        console.log("Affichage des animes");
        break;
      case "mangas":
        console.log("Affichage des mangas");
        break;
      default:
        console.log("Onglet inconnu");
    }
    // Si vous voulez mettre à jour l'état pour un onglet sélectionné
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
        console.log("test manga hihi")
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

    // if (selectedTab === "anime") {
    //   fetchAnimes();
    // } else if (selectedTab === "manga") {
    //   fetchMangas();
    // }
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
          <h3 className="mt-4 text-2xl font-bold">Trending Now</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                    key={index}
                    width={225}
                    height={320}
                    alt={`Loading image ${index + 1}`}
                    src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                  />
              ))
            ) : (
              topAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardHeader className="absolute justify-end">
                    {/* <Button isIconOnly color="danger" aria-label="Delete" onPress={}>
                      <TrashIcon />
                    </Button> */}
                  </CardHeader>
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Popular this season</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                    key={index}
                    width={225}
                    height={320}
                    alt={`Loading image ${index + 1}`}
                    src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                  />
              ))
            ) : (
              popularAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Top Rated Animes</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              scoredAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Action Animes</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              actionAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Animes Movies</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              movieAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Animes in 12 episodes</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              episodesAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime released in 2000</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              premieredAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime that has finished airing</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              statusAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime produced by Shueisha</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              producerAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime distributed by AnimEigo</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              licensorAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime dessinated by Madhouse</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              studioAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime that comes from a Manga</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              sourceAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime with episodes of 27 minutes</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              durationAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Anime prohibited for under 13s</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              ratingAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">All Time Popular</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16">
            {loading ? (
              new Array(18).fill(null).map((_, index) => (
                <Image
                    key={index}
                    width={225}
                    height={320}
                    alt={`Loading image ${index + 1}`}
                    src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                  />
              ))
            ) : (
              allTimePopularAnimes.map((anime) => (
                <Card key={anime.Name} isPressable isHoverable isBlurred isFooterBlurred radius="lg" className="border-none">
                  <Image width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{anime.Name}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
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
          <h3 className="mt-4 text-2xl font-bold">Best Ranked Mangas</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
              {loading ? (
                new Array(6).fill(null).map((_, index) => (
                  <Image
                      key={index}
                      width={225}
                      height={320}
                      alt={`Loading image ${index + 1}`}
                      src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                    />
                ))
              ) : (
                rankedMangas.map((manga) => (
                  <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                    <Image 
                      width={225} 
                      alt={`Image of ${manga.title}`} 
                      src={manga.main_picture.medium || "/placeholder-550x550.png"}
                    />
                    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                      <p className="text-tiny text-white/80">{manga.title}</p>
                      <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                        EDIT
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            <h3 className="mt-14 text-2xl font-bold">Most Popular Mangas</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              popularMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">NSFW Mangas</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              nsfwMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Mangas that has finished airing</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              statusMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          
          <h3 className="mt-14 text-2xl font-bold">Mangas that has more than XXX volumes</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              volumesMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Mangas writed by FAUT QUE JE LE METTE</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              authorMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Mangas by mediatype qdhqsudhqi</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              mediaTypeMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Mangas that has started at XXX yearr</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              startDateMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <h3 className="mt-14 text-2xl font-bold">Mangas that has XXX chapters</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
            {loading ? (
              new Array(6).fill(null).map((_, index) => (
                <Image
                  key={index}
                  width={225}
                  height={320}
                  alt={`Loading image ${index + 1}`}
                  src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
                />
              ))
            ) : (
              chaptersMangas.map((manga) => (
                <Card key={manga.title} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
                  <Image
                    width={225}
                    alt={`Image of ${manga.title}`}
                    src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{manga.title}</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                      EDIT
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

        </>
      )}
    </section>
  );
}
