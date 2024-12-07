import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

interface AnimeFilterProps {
  label: string;
  placeholder: string;
  description: string;
  options: { label: string; value: string }[]; // Type des options
  onChange?: (value: string) => void; // Ajouter une prop onChange pour remonter la valeur sélectionnée
}

const AnimeFilter: React.FC<AnimeFilterProps> = ({
  label,
  placeholder,
  description,
  options,
  onChange,
}) => {
  const handleSelection = (key: React.Key | null) => {
    if (onChange && key !== null) {
      onChange(String(key)); // Convertit le Key en string et remonte la valeur sélectionnée
    }
  };

  return (
    <Autocomplete
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      className="max-w-xs"
      description={description}
      onSelectionChange={handleSelection} // Utilisation du gestionnaire pour détecter les changements
    >
      {options.map((option) => (
        <AutocompleteItem key={option.value} value={option.value}>
          {option.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default AnimeFilter;
