import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';

interface AnimeFilterProps {
    label: string;
    placeholder: string;
    description: string;
    options: { label: string; value: string }[]; // Type des options
}

const AnimeFilter: React.FC<AnimeFilterProps> = ({
    label,
    placeholder,
    description,
    options,
}) => {
    return (
        <Autocomplete
            label={label}
            labelPlacement="outside"
            placeholder={placeholder}
            className="max-w-xs"
            description={description}
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
