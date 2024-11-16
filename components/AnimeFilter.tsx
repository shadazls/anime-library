import { Autocomplete } from "@nextui-org/autocomplete";

interface AnimeFilterProps {
  label: string;
  placeholder: string;
  description: string;
}

const AnimeFilter: React.FC<AnimeFilterProps> = ({ label, placeholder, description }) => {
  return (
    <Autocomplete
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      className="max-w-xs"
      description={description}
    />
  );
};

export default AnimeFilter;
