import { useState, useEffect } from "react";
import { SearchInput } from "@/components/SearchInput";
import AnimeFilter from "./AnimeFilter";

const FilterOptions: React.FC = () => {
  const [genres, setGenres] = useState<{ label: string, value: string }[]>([]); // Format des genres

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
        options={[]}
      />
      <AnimeFilter 
        label="Episodes"
        placeholder="Any"
        description="The number of episodes of the anime"
        options={[]}
      />
      <AnimeFilter 
        label="Producers"
        placeholder="Any"
        description="The production companies or producers of the anime"
        options={[]}
      />
      <AnimeFilter 
        label="Licensors"
        placeholder="Any"
        description="The licensors of the anime (e.g., streaming platforms)"
        options={[]}
      />
      <AnimeFilter 
        label="Type"
        placeholder="Any"
        description="The type of the anime (e.g., TV series, movie, OVA, etc.)"
        options={[]}
      />
    </div>
  );
};

export default FilterOptions;
