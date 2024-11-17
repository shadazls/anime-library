"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import FilterOptions from "@/components/FilterOptions"; // Composant des filtres
import { SearchInput } from "@/components/SearchInput";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { SortIcon } from "@/components/icons";

// Définir une interface pour représenter un anime
interface Anime {
  Name: string;
  image_url: string;
}

export default function CatalogPage() {
  const [animes, setAnimes] = useState<Anime[]>([]); // Animes récupérés avec pagination
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [itemsPerPage, setItemsPerPage] = useState(18); // Nombre d'animés par page (valeur initiale)
  const [selectedTab, setSelectedTab] = useState<string>("18"); // Tab sélectionné

  // Fonction de récupération des animes avec pagination
  const fetchAnimes = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/animes?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch animes");
      }

      const data = await response.json();
      setAnimes(data.animes); // Mettez à jour l'état des animés
      setTotalPages(data.totalPages); // Mettez à jour le nombre total de pages
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les animes quand la page ou le nombre d'animés par page change
  useEffect(() => {
    fetchAnimes(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    document.body.style.background = '#121212';
  }, []);

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

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      <h1 className="text-6xl font-bold">Anime Catalog</h1>

      {/* Barre de filtres */}
      <FilterOptions /><div className="max-w-md">
        
      </div>
        <div className="flex h-10 space-x-4 justify-end">
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
            <Image
              key={index}
              width={225}
              height={320}
              alt={`Loading image ${index + 1}`}
              src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          ))
        ) : (
          animes.map((anime) => (
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
