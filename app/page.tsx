"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import FilterOptions from "@/components/FilterOptions";

// Définir une interface pour représenter un anime
interface Anime {
  Name: string; // Nom de l'anime
  image_url: string; // URL de l'image de l'anime
}

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]); // État pour stocker les animés
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  useEffect(() => {
    // Récupère les animés classés par Rank
    const fetchAnimes = async () => {
      try {
        const [response, response2] = await Promise.all([
          fetch("/api/animes/ranked"),
          fetch("/api/animes/popularity"),
        ]);
        // const response = await fetch("/api/animes/ranked");
        if (!response.ok) {
          throw new Error("Failed to fetch animes");
        }
        const data = await response.json();
        console.log(data);
        setAnimes(data);
        const data2 = await response2.json();
        console.log(data2);
        setPopularAnimes(data2);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mx-24">
      {/* Barre de recherche et filtres */}
      <div className="mt-8 flex gap-4">
        <FilterOptions />
      </div>

      <h3 className="mt-8 text-2xl font-bold">Top Anime</h3>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          animes.map((anime) => (
            <Card
              key={anime.Name}
              isBlurred
              isFooterBlurred
              radius="lg"
              className="border-none"
            >
              <Image
                width={225}
                alt={`Image of ${anime.Name}`}
                src={anime.image_url || "https://via.placeholder.com/225"}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">{anime.Name}</p>
                <Button
                  className="text-tiny text-white bg-black/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                >
                  EDIT
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <h3 className="mt-8 text-2xl font-bold">Popularity</h3>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          popularAnimes.map((anime) => (
            <Card
              key={anime.Name}
              isBlurred
              isFooterBlurred
              radius="lg"
              className="border-none"
            >
              <Image
                width={225}
                alt={`Image of ${anime.Name}`}
                src={anime.image_url || "https://via.placeholder.com/225"}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">{anime.Name}</p>
                <Button
                  className="text-tiny text-white bg-black/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                >
                  EDIT
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
