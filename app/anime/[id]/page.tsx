"use client";

import { useEffect, useState } from "react";
import { ObjectId } from "mongoose";
import AnimeInfo from "@/components/AnimeInfo";
import AnimeDetails from "@/components/AnimeDetails";
import AnimeDescription from "@/components/AnimeDescription";
import TrailerModal from "@/components/TrailerModal";
import TabsSection from "@/components/TabsSection";
import { useDisclosure } from "@nextui-org/react";
import ItemGrid from "@/components/ItemGrid";

interface Anime {
  _id: ObjectId;
  Name: string;
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
  Members: number;
  image_url: string;
  trailer_url?: string;
}

interface AnimeDetailParams {
  params: {
    id: string;
  };
}

interface Relation {
  id: number;
  title: {
    romaji: string;
    english?: string;
  };
  image: string;
  type: string;
  relationType: string;
}

const AnimeDetailsPage = ({ params }: AnimeDetailParams) => {
  const { id } = params;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [relations, setRelations] = useState<Relation[] | null>(null);

  useEffect(() => {
    document.body.style.background = "#121212"; // Fond sombre
    if (!id) return;
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/animes/anime?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch anime details");
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnimeDetails();
  }, [id]);

  const fetchRelations = async () => {
    if (!anime) return;

    try {
      const query = `
        query ($search: String) {
          Media(search: $search, type: ANIME) {
            relations {
              edges {
                relationType
                node {
                  id
                  title {
                    romaji
                    english
                  }
                  type
                  coverImage {
                    large
                  }
                }
              }
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

      const fetchedRelations = data?.Media?.relations?.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        image: edge.node.coverImage.large,
        type: edge.node.type,
        relationType: edge.relationType,
      }));

      setRelations(fetchedRelations || []);
    } catch (error) {
      console.error("Failed to fetch relations:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "relations") {
      fetchRelations();
    }
  }, [activeTab]);

  const handleTrailerClick = async () => {
    if (!anime) return;

    // Si `trailer_url` existe déjà, utilise-le directement
    if (anime.trailer_url) {
      setTrailerUrl(anime.trailer_url);
      onOpen();
      return;
    }

    try {
      // Requête à AniList pour récupérer le trailer
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
        const fetchedTrailerUrl = `https://www.youtube.com/embed/${data.Media.trailer.id}`;

        // Mets à jour le trailer dans la base de données
        await fetch(`/api/animes/editAnime?id=${anime._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trailer_url: fetchedTrailerUrl }),
        });

        // Mets à jour localement
        setAnime((prev) => (prev ? { ...prev, trailer_url: fetchedTrailerUrl } : prev));
        setTrailerUrl(fetchedTrailerUrl);
        onOpen();
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="flex">
            <AnimeDetails anime={anime!} />
            <AnimeDescription synopsis={anime!.Synopsis} />
          </div>
        );
      case "relations":
        return relations ? (
          <ItemGrid
            key="relations"
            loading={!relations}
            items={relations}
            getId={(relation) => relation.id}
            getName={(relation) => relation.title.romaji}
            getImage={(relation) => relation.image}
          />
        ) : (
          <p>Loading relations...</p>
        );
      case "characters":
        return <p>Characters</p>;
      case "staff":
        return <p>Staff</p>;
      case "reviews":
        return <p>Reviews</p>;
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
            onTrailerClick={handleTrailerClick}
          />
          <TabsSection onTabChange={(key) => setActiveTab(key)}/>
          {renderContent()}
          <TrailerModal isOpen={isOpen} onClose={onClose} trailerUrl={trailerUrl} />
        </>
      )}
    </section>
  );
};

export default AnimeDetailsPage;

