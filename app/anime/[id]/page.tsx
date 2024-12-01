"use client";

import { useEffect, useState } from "react";
import { ObjectId } from "mongoose";
import { Image } from "@nextui-org/image";
import StarIcon from "@/components/StarIcon";
import { Button } from "@nextui-org/button";
import PlayIcon from "@/components/PlayIcon";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import BookmarkIcon from "@/components/BookmarkIcon";
import CheckIcon from "@/components/CheckIcon";
import EyeRegularIcon from "@/components/EyeRegularIcon";
import { Tabs, Tab } from "@nextui-org/tabs";


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
        console.log("data: ", data);
        setAnime(data);
        console.log("anime: ", anime);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetails();
  }, [id]);

  const fetchTrailer = async () => {
    if (!anime) return;

    try {
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

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      const { data } = await response.json();

      if (data?.Media?.trailer?.site === "youtube") {
        const trailerUrl = `https://www.youtube.com/watch?v=${data.Media.trailer.id}`;
        window.open(trailerUrl, "_blank"); // Ouvre le trailer dans un nouvel onglet
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <section className="flex flex-col justify-center gap-8 py-8 md:py-12 mx-24">
      <div className="flex flex-col">

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
                  onPress={fetchTrailer}
                >
              Watch trailer
            </Button>
            <h1 className="text-4xl mt-8 font-bold text-white">{anime.Name}</h1>

            <div className="flex gap-2 items-center">
              <StarIcon fill="#7d7d7d"></StarIcon>
              <p>{anime.Score}</p>
            </div>
            <div className="flex mt-4 gap-4 w-full">
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

        </div>
        <Tabs className="my-16 text-8xl" size="lg" aria-label="Display" variant="underlined" disabledKeys={["relations", "characters", "staff", "reviews"]}>
          <Tab key="overview" title="Overview" />
          <Tab key="relations" title="Relations" />
          <Tab key="characters" title="Characters" />
          <Tab key="staff" title="Staff" />
          <Tab key="reviews" title="Reviews" />
        </Tabs>
        {/* <h2 className="text-2xl font-bold my-16">Overview</h2> */}
        <div className="flex">
          <div className="flex flex-col mr-32 min-w-96">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="flex gap-8">
              <ul className="space-y-2">
                <li>
                  <p className="text-gray-400">Type</p>
                </li>
                <li>
                  <p className="text-gray-400">Episodes</p>
                </li>
                <li>
                  <p className="text-gray-400">Genres</p>
                </li>
                <li>
                  <p className="text-gray-400">Aired</p>
                </li>
                <li>
                  <p className="text-gray-400">Status</p>
                </li>
                <li>
                  <p className="text-gray-400">Premiered</p>
                </li>
                <li>
                  <p className="text-gray-400">Producers</p>
                </li>
                <li>
                  <p className="text-gray-400">Licensors</p>
                </li>
                <li>
                  <p className="text-gray-400">Studios</p>
                </li>
                <li>
                  <p className="text-gray-400">Source</p>
                </li>
                <li>
                  <p className="text-gray-400">Status</p>
                </li>
                <li>
                  <p className="text-gray-400">Duration</p>
                </li>
                <li>
                  <p className="text-gray-400">Rating</p>
                </li>
                <li>
                  <p className="text-gray-400">Rank</p>
                </li>
                <li>
                  <p className="text-gray-400">Popularity</p>
                </li>
                <li>
                  <p className="text-gray-400">Favorites</p>
                </li>
                <li>
                  <p className="text-gray-400">Members</p>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <p>{anime.Type}</p> 
                </li>
                <li>
                  <p>{anime.Episodes}</p> 
                </li>
                <li>
                  <p>{anime.Genres.join(", ")}</p> 
                </li>
                <li>
                  <p>{anime.Aired}</p> 
                </li>
                <li>
                  <p>{anime.Status}</p> 
                </li>
                <li>
                  <p>{anime.Premiered}</p>
                </li>
                <li>
                  <p>{anime.Producers.join(", ")}</p>
                </li>
                <li>
                  <p>{anime.Licensors.join(", ")}</p>
                </li>
                <li>
                  <p>{anime.Studios.join(", ")}</p>
                </li>
                <li>
                  <p>{anime.Source}</p>
                </li>
                <li>
                  <p>{anime.Status}</p>
                </li>
                <li>
                  <p>{anime.Duration}</p>
                </li>
                <li>
                  <p>{anime.Rating}</p>
                </li>
                <li>
                  <p>{anime.Rank}</p>
                </li>
                <li>
                  <p>{anime.Popularity}</p>
                </li>
                <li>
                  <p>{anime.Favorites}</p>
                </li>
                <li>
                  <p>{anime.Members}</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-400">{anime.Synopsis}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimeDetailsPage;
