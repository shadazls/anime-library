import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { SearchIcon } from "@/components/icons";
import { ChangeEvent } from "react";

interface SearchInputProps {
  searchText: string;  // Recevoir le texte de recherche
  onSearch: (searchText: string) => void;  // Fonction de callback pour transmettre le texte
}

export const SearchInput: React.FC<SearchInputProps> = ({ searchText, onSearch }) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);  // Remonter le texte de recherche
  };

  return (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      label="Search"
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
      value={searchText}  // Affiche le texte de recherche actuel
      onChange={handleChange}  // Met à jour le texte lorsque l'utilisateur tape
    />
  );
};
