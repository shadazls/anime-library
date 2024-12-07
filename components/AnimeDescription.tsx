import ReactMarkdown from 'react-markdown';

interface AnimeDescriptionProps {
    synopsis: string;
}

const AnimeDescription = ({ synopsis }: AnimeDescriptionProps) => {
    return (
        <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <ReactMarkdown className="text-gray-400">{synopsis}</ReactMarkdown>
        </div>
    );
};

export default AnimeDescription;
