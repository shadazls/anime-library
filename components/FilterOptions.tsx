import { useState, useEffect } from "react";
import { SearchInput } from "@/components/SearchInput";
import AnimeFilter from "./AnimeFilter";

const FilterOptions: React.FC = () => {
  const [genres, setGenres] = useState<{ label: string, value: string }[]>([]); // Format des genres
  const [producers, setProducers] = useState<{ label: string, value: string }[]>([]); // Format des producteurs
  const [licensors, setLicensors] = useState<{ label: string, value: string }[]>([]); // Format des licensors
  const [types, setTypes] = useState<{ label: string, value: string }[]>([]); // Format des types

  const scoreOptions = [
    { label: "> 2.5/10", value: "2.5" },
    { label: "> 5/10", value: "5" },
    { label: "> 7.5/10", value: "7.5" },
    { label: "< 2.5/10", value: "2.5" },
  ];

  const episodeOptions = [
    { label: "More than 12 episodes", value: "12+" },
    { label: "More than 24 episodes", value: "24+" },
    { label: "More than 36 episodes", value: "36+" },
    { label: "Less than 12 episodes", value: "12-" },
    { label: "Less than 24 episodes", value: "24-" },
    { label: "Less than 36 episodes", value: "36-" },
  ];

  // Récupérer les genres depuis l'API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/animes/genres");
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const data = await response.json();
        // Format des genres pour l'Autocomplete
        const genreOptions = data.map((genre: { _id: string }) => ({
          label: genre._id,
          value: genre._id,
        }));
        setGenres(genreOptions);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Récupérer les producteurs depuis l'API
  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await fetch("/api/animes/producers");
        if (!response.ok) {
          throw new Error("Failed to fetch producers");
        }
        const data = await response.json();
        // Format des producteurs pour l'Autocomplete
        const producerOptions = data.map((producer: { _id: string }) => ({
          label: producer._id,
          value: producer._id,
        }));
        setProducers(producerOptions);
      } catch (error) {
        console.error("Error fetching producers:", error);
      }
    };

    fetchProducers();
  }, []);

  // Récupérer les licensors depuis l'API
  useEffect(() => {
    const fetchLicensors = async () => {
      try {
        const response = await fetch("/api/animes/licensors");
        if (!response.ok) {
          throw new Error("Failed to fetch licensors");
        }
        const data = await response.json();
        // Format des licensors pour l'Autocomplete
        const licensorOptions = data.map((licensor: { _id: string }) => ({
          label: licensor._id,
          value: licensor._id,
        }));
        setLicensors(licensorOptions);
      } catch (error) {
        console.error("Error fetching licensors:", error);
      }
    };

    fetchLicensors();
  }, []);

  // Récupérer les types depuis l'API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/animes/types");
        if (!response.ok) {
          throw new Error("Failed to fetch types");
        }
        const data = await response.json();
        // Format des types pour l'Autocomplete
        const typesOptions = data.map((type: { _id: string }) => ({
          label: type._id,
          value: type._id,
        }));
        setTypes(typesOptions);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="mt-8 flex gap-4">
      <SearchInput />
      <AnimeFilter 
        label="Genres"
        placeholder="Any"
        description="The genres of the anime"
        options={genres} // Passer les genres formatés
      />
      <AnimeFilter 
        label="Scores"
        placeholder="Any"
        description="The score of the anime"
        options={scoreOptions}
      />
      <AnimeFilter 
        label="Episodes"
        placeholder="Any"
        description="The number of episodes of the anime"
        options={episodeOptions}
      />
      <AnimeFilter 
        label="Producers"
        placeholder="Any"
        description="The production companies or producers of the anime"
        options={producers} // Passer les producteurs récupérés dynamiquement
      />
      <AnimeFilter 
        label="Licensors"
        placeholder="Any"
        description="The licensors of the anime (e.g., streaming platforms)"
        options={licensors} // Passer les licensors récupérés dynamiquement
      />
      <AnimeFilter 
        label="Type"
        placeholder="Any"
        description="The type of the anime (e.g., TV series, movie, OVA, etc.)"
        options={types} // Passer les types récupérés dynamiquement
      />
    </div>
  );
};

export default FilterOptions;
