"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import FilterOptions from "@/components/FilterOptions"; // Composant des filtres
import { Pagination } from "@nextui-org/pagination";
import { useDisclosure } from "@nextui-org/react";
import TrashIcon from "@/components/TrashIcon";
import { ObjectId } from 'mongodb';
import { Skeleton } from "@nextui-org/skeleton";
import EditIcon from "@/components/EditIcon";
import AnimeModal from "@/components/AnimeModal"; // Import du composant modal


// Définir une interface pour représenter un anime
export interface Anime {
  _id: ObjectId;
  Name: string;
  image_url: string;
  english_name?: string;
  other_name?: string;
  Synopsis?: string;
  Genres?: string;
  Score?: number;
  Type?: string;
  Episodes?: number;
  Aired?: string;
  Premiered?: string;
  Status?: string;
  Producers?: string;
  Licensors?: string;
  Studios?: string;
  Source?: string;
  Duration?: string;
}


export default function AnimeCatalogPage() {
  const [animes, setAnimes] = useState<Anime[]>([]); // Animes récupérés avec pagination
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [itemsPerPage, setItemsPerPage] = useState(18); // Nombre d'animés par page (valeur initiale)
  const [selectedTab, setSelectedTab] = useState<string>("18"); // Tab sélectionné
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState<string>("");


  // Fonction de récupération des animes avec pagination et recherche
  const fetchAnimes = async (page: number, limit: number, name: string) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        name: name || "",  // Si searchText est vide, on envoie une chaîne vide
      }).toString();

      const response = await fetch(`/api/animes?${query}`);

      if (!response.ok) {
        throw new Error("Failed to fetch animes");
      }

      const data = await response.json();
      console.log("Fetched animes data:", data); // Ajoutez ce log
      setAnimes(data.animes);  // Mise à jour des animes récupérés
      setTotalPages(data.pagination.totalPages);  // Mise à jour du nombre total de pages
    } catch (error) {

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser le texte de recherche pour récupérer les animes chaque fois que searchText change
  useEffect(() => {
    fetchAnimes(currentPage, 18, searchText);  // Par exemple, 18 animes par page
  }, [searchText, currentPage]);  // Déclenche à chaque changement de searchText

  // Charger les animes quand la page ou le nombre d'animés par page change
  useEffect(() => {
    fetchAnimes(currentPage, itemsPerPage, searchText);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    document.body.style.background = '#121212';
  }, []);



    // Fonction qui sera appelée lorsque l'utilisateur tape dans le champ de recherche
    const handleSearch = (text: string) => {
      setSearchText(text);  // Met à jour l'état du texte de recherche
    };
  

  // Gérer l'ouverture du modal pour modifier un anime
  const openEditAnimeModal = async (anime: Anime) => {
    try {
      const response = await fetch(`/api/animes/anime?id=${anime._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch anime details");
      }
      const fullAnime = await response.json(); // Anime avec tous les champs
      console.log("Full anime data fetched for editing:", fullAnime); // Vérifiez ici si toutes les données sont présentes
      setSelectedAnime(fullAnime); // Passe toutes les données récupérées
      setModalMode("edit");
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching anime for editing:", error);
    }
  };
  
  

  const openAddAnimeModal = () => {
    setModalMode("add");
    setSelectedAnime(null); // Réinitialiser les données sélectionnées
    setModalOpen(true); // Ouvrir le modal pour ajouter un nouvel anime
  };
  
  
  

  // Fonction pour changer le nombre d'animés par page en fonction du Tab sélectionné
  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key as string); // Convertir React.Key en string
    switch (key) {
      case "18":
        setItemsPerPage(18);
        break;
      case "36":
        setItemsPerPage(36);
        break;
      case "54":
        setItemsPerPage(54);
        break;
      default:
        setItemsPerPage(18); // Valeur par défaut
    }
    setCurrentPage(1); // Réinitialise à la première page quand le nombre d'animés par page change
  };


   // Ajouter un nouvel anime
   const handleAddAnime = async (animeData: Partial<Anime>) => {
    try {
      const response = await fetch("/api/animes/addNewAnime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(animeData),
      });
      if (response.ok) {
        fetchAnimes(currentPage, itemsPerPage, searchText);
      }
    } catch (error) {
      console.error("Error adding anime:", error);
    }
  };

  // Modifier un anime existant
  const handleEditAnime = async (animeData: Partial<Anime>) => {
    if (!animeData._id) return; // Vérification pour éviter une erreur
    try {
      const response = await fetch(`/api/animes/editAnime?id=${animeData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(animeData),
      });
      if (response.ok) {
        fetchAnimes(currentPage, itemsPerPage, searchText);
      }
    } catch (error) {
      console.error("Error editing anime:", error);
    }
  };

  // Supprimer un anime
  const handleDeleteAnime = async (animeId: ObjectId) => {
    try {
      const response = await fetch(`/api/animes/deleteAnime?id=${animeId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAnimes((prevAnimes) => prevAnimes.filter((anime) => anime._id !== animeId));
      } else {
        console.error("Failed to delete anime");
      }
    } catch (error) {
      console.error("Error deleting anime:", error);
    }
  };

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      <h1 className="text-6xl font-bold">Anime Catalog</h1>

      {/* Barre de filtres */}
      <FilterOptions onSearch={handleSearch}/>


      {/* Bouton pour ajouter un anime */}
      <div className="flex justify-end">
        <Button onPress={openAddAnimeModal} color="primary">
          Add Anime
        </Button>
      </div>
      

      {/* Affichage des animés */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
        {loading ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="rounded-xl w-[225px] h-[320px]" />
            </div>
          ))
        ) : (
          animes.map((anime) => (
            <Card key={anime.Name} isPressable isHoverable isFooterBlurred radius="lg" className="border-none">
              <Image isZoomed width={225} alt={`Image of ${anime.Name}`} src={anime.image_url || "https://via.placeholder.com/225"} />
              <CardHeader className="absolute justify-end gap-2">
                <Button isIconOnly variant="faded" color="default" aria-label="Edit" onPress={() => openEditAnimeModal(anime)}>
                  <EditIcon />
                </Button>
                <Button isIconOnly variant="faded" color="default" aria-label="Delete" onPress={() => handleDeleteAnime(anime._id)}>
                  <TrashIcon />
                </Button>
              </CardHeader>
              <CardFooter className="absolute bg-black/30 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-center">
                <p className="text-small text-white/70">{anime.Name}</p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          initialPage={currentPage}
          total={totalPages}
          onChange={(page) => setCurrentPage(page)}
          className="mt-8"
          size="lg"
          showControls
        />
      </div>

      {/* Modal */}
      <AnimeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === "add" ? handleAddAnime : handleEditAnime}
        mode={modalMode}
        initialData={modalMode === "edit" && selectedAnime ? selectedAnime : undefined}
      />
    </section>
  );
}
