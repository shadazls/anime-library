import { SearchInput } from "@/components/SearchInput";
import AnimeFilter from "./AnimeFilter";

const FilterOptions: React.FC = () => {
  return (
    <div className="mt-8 flex gap-4">
      <SearchInput />
      <AnimeFilter 
        label="Genres"
        placeholder="Any"
        description="The genres of the anime"
      />
      <AnimeFilter 
        label="Scores"
        placeholder="Any"
        description="The score of the anime"
      />
      <AnimeFilter 
        label="Episodes"
        placeholder="Any"
        description="The number of episodes of the anime"
      />
      <AnimeFilter 
        label="Producers"
        placeholder="Any"
        description="The production companies or producers of the anime"
      />
      <AnimeFilter 
        label="Licensors"
        placeholder="Any"
        description="The licensors of the anime (e.g., streaming platforms)"
      />
      <AnimeFilter 
        label="Type"
        placeholder="Any"
        description="The type of the anime (e.g., TV series, movie, OVA, etc.)"
      />
    </div>
  );
};

export default FilterOptions;
