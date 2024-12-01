"use client";

import { useEffect, useState } from "react";
import { ObjectId } from "mongoose";
import { Image } from "@nextui-org/image";
import { StarIcon } from "@/components/StarIcon";
import { Button } from "@nextui-org/button";
import PlayIcon from "@/components/PlayIcon";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import BookmarkIcon from "@/components/BookmarkIcon";
import CheckIcon from "@/components/CheckIcon";
import EyeRegularIcon from "@/components/EyeRegularIcon";


interface Anime {
  _id: ObjectId;
  Name: string;
  english_name: string;
  other_name: string;
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
  scored_by: number;
  Members: number;
  image_url: string;
}

interface AnimeDetailParams {
  id: string;
}

interface AnimeDetailProps {
  params: AnimeDetailParams;
}

const AnimeDetailsPage = ({ params }: AnimeDetailProps) => {
  const { id } = params; // Récupérer l'ID de l'URL
  const [anime, setAnime] = useState<Anime>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.background = "#121212"; // Fond sombre
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/animes/anime?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch anime details");
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <section className="flex flex-col justify-center gap-8 py-8 md:py-12 mx-24">
      <div className="flex justify-start gap-4">
        {/* Image de l'animé */}
        <Image
          className="mr-24"
          alt={`Image of ${anime.Name}`}
          src={(anime.image_url) || "https://via.placeholder.com/225"}
          isZoomed
        />

        <div className="flex flex-col gap-4 w-full">
          <Button
                className="text-sm font-medium text-black bg-white self-end"
                variant="flat"
                radius="sm"
                startContent={<PlayIcon/>}
              >
            Watch trailer
          </Button>
          <h1 className="text-4xl font-bold text-white">{anime.Name}</h1>
          <p className="text-lg font-medium text-gray-400 mt-2">⭐⭐⭐⭐⭐ {anime.Score}</p>
          <div className="flex gap-4">
            <Button
                className="text-sm font-medium text-white bg-default-100"
                variant="flat"
                radius="sm"
                startContent={<EyeRegularIcon/>}
              >
                Watching
            </Button>
            <Button
                className="text-sm font-medium text-white bg-default-100"
                variant="flat"
                radius="sm"
                startContent={<BookmarkIcon/>}
              >
                To Watch
            </Button>
            <Button
                className="text-sm font-medium text-white bg-default-100"
                variant="flat"
                radius="sm"
                startContent={<CheckIcon/>}
              >
                Watched
            </Button>
          </div>
        </div>

        {/* Boutons */}
        {/* <div className="flex gap-4">
          <button className="rounded-full bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
            Watching
          </button>
          <button className="rounded-full bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
            To Watch
          </button>
          <button className="rounded-full bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
            Watched
          </button>
        </div> */}

        {/* Section description */}
        {/* <div className="bg-gray-800 text-left text-gray-200 p-6 rounded-lg w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="leading-relaxed">{anime.Synopsis}</p>
        </div> */}

        {/* Détails supplémentaires */}
        {/* <div className="bg-gray-800 text-gray-200 p-6 rounded-lg w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Details</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Type:</span> {anime.Type}
            </li>
            <li>
              <span className="font-medium">Episodes:</span> {anime.Episodes}
            </li>
            <li>
              <span className="font-medium">Genres:</span> {anime.Genres.join(", ")}
            </li>
            <li>
              <span className="font-medium">Aired:</span> {anime.Aired}
            </li>
            <li>
              <span className="font-medium">Status:</span> {anime.Status}
            </li>
          </ul>
        </div> */}
      </div>
    </section>
  );
};

export default AnimeDetailsPage;
