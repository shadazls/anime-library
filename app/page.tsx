"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import FilterOptions from "@/components/FilterOptions"; // Composant des filtres
import { SearchInput } from "@/components/SearchInput";
import { Divider } from "@nextui-org/divider";

// Définir une interface pour représenter un anime
interface Anime {
  Name: string;
  image_url: string;
}

export default function Home() {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]); // Animes par rank
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]); // Animes par popularité
  const [allTimePopularAnimes, setAllTimePopularAnimes] = useState<Anime[]>([]); // Animes populaires de tous les temps
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  // Fonction de récupération des animes
  useEffect(() => {
    document.body.style.background = 'url(/bgChainsawman.jpg) no-repeat center top, #121212';
    // document.body.classList.add("background-main")#121212
    const fetchAnimes = async () => {
      try {
        const [rankResponse, popularityResponse, allTimeResponse] = await Promise.all([
          fetch("/api/animes/ranked"),
          fetch("/api/animes/popularity"),
          fetch("/api/animes/favorites"),
        ]);

        if (!rankResponse.ok || !popularityResponse.ok || !allTimeResponse.ok) {
          throw new Error("Failed to fetch animes");
        }

        const rankData = await rankResponse.json();
        const popularityData = await popularityResponse.json();
        const allTimeData = await allTimeResponse.json();

        setTopAnimes(rankData);
        setPopularAnimes(popularityData);
        setAllTimePopularAnimes(allTimeData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      <h1 className="text-6xl font-bold mt-48">Chainsaw Man</h1>
      <p className="text-xl w-1/4">Denji has a simple dream -- to live a happy and peaceful life, spending time with a girl</p>
      {/* Barre de recherche et filtres */}
      {/* <div className="mt-20 flex gap-4">
        <FilterOptions />
      </div> */}

      <h3 className="mt-48 text-2xl font-bold">Trending Now</h3>
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

      <h3 className="mt-14 text-2xl font-bold">All Time Popular</h3>
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
      <Button
        className="mt-8 text-base font-medium text-black bg-white"
        variant="flat"
        radius="sm"
        size="lg"
      >
        Show More
      </Button>
    </section>
  );
}
