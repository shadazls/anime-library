"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import FilterOptions from "@/components/FilterOptions"; // Composant des filtres
import { SearchInput } from "@/components/SearchInput";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { SortIcon } from "@/components/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import FilterIcon from "@/components/FilterIcon";
import TrashIcon from "@/components/TrashIcon";
import { ObjectId } from 'mongodb';
import { Skeleton } from "@nextui-org/skeleton";
import EditIcon from "@/components/EditIcon";

// Définir une interface pour représenter un anime
interface Anime {
  _id: ObjectId;
  Name: string;
  image_url: string;
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
  const [formData, setFormData] = useState({
    Name: "",
    image_url: "",
    english_name: "",
    other_name: "",
    Synopsis: "",
    Genres: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState<string>("");  // L'état du texte de recherche

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

  // Fonction qui sera appelée lorsque l'utilisateur tape dans le champ de recherche
  const handleSearch = (text: string) => {
    setSearchText(text);  // Met à jour l'état du texte de recherche
  };

  // Charger les animes quand la page ou le nombre d'animés par page change
  useEffect(() => {
    fetchAnimes(currentPage, itemsPerPage, searchText);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    document.body.style.background = '#121212';
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddAnime = async () => {
    setErrorMessage(""); // Reset error message
    try {
      const response = await fetch("/api/animes/addNewAnime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add anime");
      }

      // Ferme le modal et recharge les animes
      onOpenChange();
      fetchAnimes(currentPage, itemsPerPage, searchText);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    }
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

  const handleDeleteAnime = async (animeId: ObjectId) => {
    try {
      const response = await fetch(`/api/animes/deleteAnime?id=${animeId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert("Anime deleted successfully");
        // Actualiser la liste des animés (ex. re-fetch les données ou filtrer localement)
        setAnimes((prevAnimes) => prevAnimes.filter((anime) => anime._id !== animeId));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete anime:", errorData.message);
        alert("Failed to delete anime");
      }
    } catch (error) {
      console.error("Error deleting anime:", error);
      alert("An error occurred while deleting the anime");
    }
  };

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      <h1 className="text-6xl font-bold">Anime Catalog</h1>

      {/* Barre de filtres */}
      <FilterOptions onSearch={handleSearch}/>
      <div className="max-w-md"></div>
        <div className="flex h-10 space-x-4 justify-end">
          <Button onPress={onOpen} color="primary">Add an anime</Button>
          <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Add an anime</ModalHeader>
                  <ModalBody className="overflow-auto" style={{ maxHeight: "70vh"}}>
                    {/* Champs principaux */}
                    <Input
                      autoFocus
                      label="Name"
                      placeholder="Enter the name of the anime"
                      variant="bordered"
                      isRequired
                      value={formData.Name}
                      onValueChange={(value) => handleFormChange("Name", value)}
                    />
                    <Input
                      label="Image URL"
                      placeholder="Enter the URL for the anime's image"
                      variant="bordered"
                      isRequired
                      value={formData.image_url}
                      onValueChange={(value) => handleFormChange("image_url", value)}
                    />
                    <Input
                      label="English name"
                      placeholder="Enter the English name of the anime"
                      variant="bordered"
                      value={formData.english_name}
                      onValueChange={(value) => handleFormChange("english_name", value)}
                    />
                    <Input
                      label="Other name"
                      placeholder="Enter the other name of the anime"
                      variant="bordered"
                      value={formData.other_name}
                      onValueChange={(value) => handleFormChange("other_name", value)}
                    />
                    <Textarea
                      label="Synopsis"
                      placeholder="Enter the synopsis"
                      variant="bordered"
                      value={formData.Synopsis}
                      onValueChange={(value) => handleFormChange("Synopsis", value)}
                    />
                    <Input
                      label="Genres"
                      placeholder="Enter the genres (e.g., Action, Sci-Fi)"
                      variant="bordered"
                      value={formData.Genres}
                      onValueChange={(value) => handleFormChange("Genres", value)}
                    />
                    {errorMessage && (
                      <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}


                    {/* Bouton pour basculer l'affichage des champs avancés */}
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {showAdvanced ? "Hide Advanced Creation" : "Advanced Creation"}
                    </button>

                    {/* Champs avancés */}
                    {showAdvanced && (
                      <div className="flex flex-col gap-3" style={{ marginTop: "1rem" }}>
                        <Input
                          label="Score"
                          type="number"
                          placeholder="Enter the score (e.g., 8.75)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Score", value)}
                        />
                        <Input
                          label="Type"
                          placeholder="Enter the type (e.g., TV, Movie)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Type", value)}
                        />
                        <Input
                          label="Episodes"
                          type="number"
                          placeholder="Enter the number of episodes"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Episodes", value)}
                        />
                        <Input
                          label="Aired"
                          placeholder="Enter the aired dates (e.g., Apr 3, 1998 to Apr 24, 1999)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Aired", value)}
                        />
                        <Input
                          label="Premiered"
                          placeholder="Enter the season and year (e.g., spring 1998)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Premiered", value)}
                        />
                        <Input
                          label="Status"
                          placeholder="Enter the status (e.g., Finished Airing)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Status", value)}
                        />
                        <Input
                          label="Producers"
                          placeholder="Enter the producers (e.g., Bandai Visual)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Producers", value)}
                        />
                        <Input
                          label="Licensors"
                          placeholder="Enter the licensors (e.g., Funimation)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Licensors", value)}
                        />
                        <Input
                          label="Studios"
                          placeholder="Enter the studios (e.g., Sunrise)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Studios", value)}
                        />
                        <Input
                          label="Source"
                          placeholder="Enter the source (e.g., Original, Manga)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Source", value)}
                        />
                        <Input
                          label="Duration"
                          placeholder="Enter the duration (e.g., 24 min per ep)"
                          variant="bordered"
                          onValueChange={(value) => handleFormChange("Duration", value)}
                        />
                      </div>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={handleAddAnime}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Divider orientation="vertical"></Divider>
          <div className="flex flex-col h-96">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="bordered"
                  startContent={<SortIcon className="" />}
                >
                  Title
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="title">Title</DropdownItem>
                <DropdownItem key="popularity">Popularity</DropdownItem>
                <DropdownItem key="rank">Rank</DropdownItem>
                <DropdownItem key="score">Score</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <p className="text-foreground-400 mt-1 text-xs">
              Sort by
            </p>
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-col items-end">
            <Tabs aria-label="Options" onSelectionChange={handleTabChange}>
              <Tab key="18" title="18" />
              <Tab key="36" title="36" />
              <Tab key="54" title="54" />
            </Tabs>
            <p className="text-foreground-400 mt-1 text-xs">
              Number of items per page
            </p>
          </div>
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
                <Button isIconOnly variant="faded" color="default" aria-label="Delete" onPress={() => handleDeleteAnime(anime._id)}>
                  <EditIcon />
                </Button>
                <Button isIconOnly variant="faded" color="default" aria-label="Delete" onPress={() => handleDeleteAnime(anime._id)}>
                  <TrashIcon />
                </Button>
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
    </section>
  );
}
