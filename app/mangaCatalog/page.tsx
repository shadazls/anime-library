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
import { Skeleton } from "@nextui-org/skeleton";
import TrashIcon from "@/components/TrashIcon";
import EditIcon from "@/components/EditIcon";
import { ObjectId } from 'mongodb';

// Définir une interface pour représenter un manga
interface Manga {
  _id: ObjectId;
  title: string;
  main_picture: {
    medium: string;
  };
}


export default function MangaCatalogPage() {
  const [mangas, setMangas] = useState<Manga[]>([]); // Mangas récupérés avec pagination
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [itemsPerPage, setItemsPerPage] = useState(18); // Nombre de mangas par page (valeur initiale)
  const [selectedTab, setSelectedTab] = useState<string>("18"); // Tab sélectionné
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    image_url: "",
    english_name: "",
    other_name: "",
    synopsis: "",
    genres: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState<string>("");  // L'état du texte de recherche

  // Fonction de récupération des mangas avec pagination
  const fetchMangas = async (page: number, limit: number, title: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mangas?page=${page}&limit=${limit}&title=${title}`);

      if (!response.ok) {
        throw new Error("Failed to fetch mangas");
      }

      const data = await response.json();
      setMangas(data.mangas); // Mettez à jour l'état des mangas
      setTotalPages(data.totalPages); // Mettez à jour le nombre total de pages
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les mangas quand la page ou le nombre de mangas par page change
  useEffect(() => {
    fetchMangas(currentPage, itemsPerPage, searchText);
  }, [currentPage, itemsPerPage, searchText]);

  useEffect(() => {
    document.body.style.background = "#121212";
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddManga = async () => {
    setErrorMessage(""); // Reset error message
    try {
      const response = await fetch("/api/mangas/addNewManga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add manga");
      }

      // Ferme le modal et recharge les mangas
      onOpenChange();
      fetchMangas(currentPage, itemsPerPage, searchText);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    }
  };

  // Fonction pour changer le nombre de mangas par page en fonction du Tab sélectionné
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
    setCurrentPage(1); // Réinitialise à la première page quand le nombre de mangas par page change
  };

  const handleDeleteManga = async (mangaId: ObjectId) => {
    try {
      const response = await fetch(`/api/mangas/deleteManga?id=${mangaId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMangas((prevMangas) => prevMangas.filter((manga) => manga._id !== mangaId));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete manga:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting manga:", error);
      alert("An error occurred while deleting the manga");
    }
  };

  // Fonction qui sera appelée lorsque l'utilisateur tape dans le champ de recherche
  const handleSearch = (text: string) => {
    setSearchText(text);  // Met à jour l'état du texte de recherche
  };

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      <h1 className="text-6xl font-bold">Manga Catalog</h1>

      {/* Barre de filtres */}
      <FilterOptions onSearch={handleSearch}/>
      <div className="max-w-md"></div>
      <div className="flex h-10 space-x-4 justify-end">
        <Button onPress={onOpen} color="primary">
          Add a manga
        </Button>
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
                      value={formData.synopsis}
                      onValueChange={(value) => handleFormChange("synopsis", value)}
                    />
                    <Input
                      label="Genres"
                      placeholder="Enter the genres (e.g., Action, Sci-Fi)"
                      variant="bordered"
                      value={formData.genres}
                      onValueChange={(value) => handleFormChange("genres", value)}
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
                        />
                        <Input
                          label="Type"
                          placeholder="Enter the type (e.g., TV, Movie)"
                          variant="bordered"
                        />
                        <Input
                          label="Episodes"
                          type="number"
                          placeholder="Enter the number of episodes"
                          variant="bordered"
                        />
                        <Input
                          label="Aired"
                          placeholder="Enter the aired dates (e.g., Apr 3, 1998 to Apr 24, 1999)"
                          variant="bordered"
                        />
                        <Input
                          label="Premiered"
                          placeholder="Enter the season and year (e.g., spring 1998)"
                          variant="bordered"
                        />
                        <Input
                          label="Status"
                          placeholder="Enter the status (e.g., Finished Airing)"
                          variant="bordered"
                        />
                        <Input
                          label="Producers"
                          placeholder="Enter the producers (e.g., Bandai Visual)"
                          variant="bordered"
                        />
                        <Input
                          label="Licensors"
                          placeholder="Enter the licensors (e.g., Funimation)"
                          variant="bordered"
                        />
                        <Input
                          label="Studios"
                          placeholder="Enter the studios (e.g., Sunrise)"
                          variant="bordered"
                        />
                        <Input
                          label="Source"
                          placeholder="Enter the source (e.g., Original, Manga)"
                          variant="bordered"
                        />
                        <Input
                          label="Duration"
                          placeholder="Enter the duration (e.g., 24 min per ep)"
                          variant="bordered"
                        />
                      </div>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary">
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
              <Button variant="bordered" startContent={<SortIcon className="" />}>
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
          <p className="text-foreground-400 mt-1 text-xs">Sort by</p>
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col items-end">
          <Tabs aria-label="Options" onSelectionChange={handleTabChange}>
            <Tab key="18" title="18" />
            <Tab key="36" title="36" />
            <Tab key="54" title="54" />
          </Tabs>
          <p className="text-foreground-400 mt-1 text-xs">Number of items per page</p>
        </div>
      </div>

      {/* Affichage des mangas */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
        {loading
          ? new Array(12).fill(null).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="rounded-xl w-[225px] h-[320px]" />
              </div>
            ))
          : mangas.map((manga) => (
              <Card
                key={manga.title}
                isPressable
                isHoverable
                isFooterBlurred
                radius="lg"
                className="border-none"
              >
                <Image
                  width={225}
                  alt={`Image of ${manga.title}`}
                  src={manga.main_picture.medium || "https://via.placeholder.com/225"}
                />
                <CardHeader className="absolute justify-end gap-2">
                  <Button isIconOnly variant="faded" color="default" aria-label="Edit">
                    <EditIcon />
                  </Button>
                  <Button isIconOnly variant="faded" color="default" aria-label="Delete" onPress={() => handleDeleteManga(manga._id)}>
                    <TrashIcon />
                  </Button>
                </CardHeader>
                <CardFooter className="absolute bg-black/30 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-center">
                  <p className="text-small text-white/70">{manga.title}</p>
                </CardFooter>
              </Card>
            ))}
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
