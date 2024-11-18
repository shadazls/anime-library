import { useState, useEffect } from "react";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@nextui-org/button";
import AnimeFilter from "./AnimeFilter";
import FilterIcon from "./FilterIcon";

const FilterOptions: React.FC = () => {
  const [genres, setGenres] = useState<{ label: string, value: string }[]>([]); // Format des genres
  const [producers, setProducers] = useState<{ label: string, value: string }[]>([]); // Format des producteurs
  const [licensors, setLicensors] = useState<{ label: string, value: string }[]>([]); // Format des licensors
  const [types, setTypes] = useState<{ label: string, value: string }[]>([]); // Format des types
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible((prevState) => !prevState);
  };

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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
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
        label="Status"
        placeholder="Any"
        description="The current status of the anime"
        options={[
          { label: "Finished Airing", value: "Finished Airing" },
          { label: "Airing", value: "Airing" },
          { label: "Not Yet Aired", value: "Not Yet Aired" },
          // Add more options as needed
        ]}
      />
      <AnimeFilter 
        label="Rating"
        placeholder="Any"
        description="The age rating of the anime"
        options={[]}
      />
      <Button color="default" variant="bordered" className="self-center" onClick={toggleFiltersVisibility}>
        Advanced Filters
      </Button>
      {isFiltersVisible && (
        <>
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
          <AnimeFilter 
            label="Studios"
            placeholder="Any"
            description="The studios that produced the anime"
            options={[]}
          />
          <AnimeFilter 
            label="Source"
            placeholder="Any"
            description="The original source material of the anime"
            options={[]}
          />
          <AnimeFilter 
            label="Duration"
            placeholder="Any"
            description="The duration of each episode"
            options={[]}
          />
          <AnimeFilter 
            label="Aired"
            placeholder="Any"
            description="The airing period of the anime"
            options={[
              { label: "Apr 3, 1998 to Apr 24, 1999", value: "Apr 3, 1998 to Apr 24, 1999" },
              { label: "Mar 1, 2010 to Mar 30, 2011", value: "Mar 1, 2010 to Mar 30, 2011" },
              // Add more options as needed
            ]}
          />

          <AnimeFilter 
            label="Premiered"
            placeholder="Any"
            description="The season and year the anime premiered"
            options={[
              { label: "Spring 1998", value: "spring 1998" },
              { label: "Winter 2010", value: "winter 2010" },
              // Add more options as needed
            ]}
          />

          <AnimeFilter 
            label="Rank"
            placeholder="Any"
            description="The ranking of the anime"
            options={[
              { label: "> 40", value: "40" },
              { label: "> 100", value: "100" },
              { label: "< 1000", value: "1000" },
              // Add more options as needed
            ]}
          />

          <AnimeFilter 
            label="Favorites"
            placeholder="Any"
            description="The number of favorites"
            options={[
              { label: "> 1000", value: "1000" },
              { label: "< 10000", value: "10000" },
              // Add more options as needed
            ]}
          />

          <AnimeFilter 
            label="Scored By"
            placeholder="Any"
            description="The number of users who scored the anime"
            options={[
              { label: "> 50000", value: "50000" },
              { label: "< 1000000", value: "1000000" },
              // Add more options as needed
            ]}
          />

          <AnimeFilter 
            label="Members"
            placeholder="Any"
            description="The number of members following the anime"
            options={[
              { label: "> 10000", value: "10000" },
              { label: "< 100000", value: "100000" },
              // Add more options as needed
            ]}
          />
        </>
      )}
    </div>
  );
};

export default FilterOptions;
