interface AnimeDescriptionProps {
    synopsis: string;
}

const AnimeDescription = ({ synopsis }: AnimeDescriptionProps) => {
    return (
        <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-400">{synopsis}</p>
        </div>
    );
};

export default AnimeDescription;
