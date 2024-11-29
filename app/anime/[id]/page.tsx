"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ObjectId } from "mongoose";

interface Anime {
    _id: ObjectId;
    Name: string;
    Synopsis: string;
    image_url: string;
}

interface AnimeDetailParams {
    id: string; // ou `id?: string` si l'ID peut être optionnel
}

interface AnimeDetailProps {
    params: AnimeDetailParams;
}

const AnimeDetailsPage = ({ params }: AnimeDetailProps) => {
  const router = useRouter();
  const { id } = params; // Récupérer l'ID de l'URL
  const [anime, setAnime] = useState<Anime>();;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Attendre que l'ID soit disponible
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
    <div className="p-6">
        return <div>Anime ID: {id}</div>;
      <h1 className="text-4xl font-bold">{anime.Name}</h1>
      <img src={anime.image_url} alt={anime.Name} className="mt-4 rounded-lg" />
      <p className="mt-4">{anime.Synopsis}</p>
      {/* Ajoutez d'autres détails ici */}
    </div>
  );
};

export default AnimeDetailsPage;
