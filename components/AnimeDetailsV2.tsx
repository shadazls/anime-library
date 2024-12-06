interface AnimeDetailsV2Props {
    anime: {
        [key: string]: any; // Permet d'accepter des données dynamiques
    };
}

const AnimeDetailsV2 = ({ anime }: AnimeDetailsV2Props) => {
    return (
        <div className="flex flex-col min-w-96 mr-32">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="flex flex-col gap-4">
                {Object.entries(anime).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                        <p className="text-gray-400 font-semibold">
                            {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p>
                            {Array.isArray(value)
                                ? value.join(', ') // Gère les tableaux comme Genres ou Studios
                                : typeof value === 'object' && value !== null
                                  ? JSON.stringify(value) // Sérialise les objets si besoin
                                  : value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimeDetailsV2;

// interface AnimeDetailsProps {
//     anime: {
//         Type: string;
//         Episodes: number;
//         Genres: string[];
//         Aired: string;
//         Status: string;
//         Premiered: string;
//         Producers: string[];
//         Licensors: string[];
//         Studios: string[];
//         Source: string;
//         Duration: string;
//         Rating: string;
//         Rank: number;
//         Popularity: number;
//         Favorites: number;
//         Members: number;
//     };
// }

// const AnimeDetailsV2 = ({ anime }: AnimeDetailsProps) => {
//     const animeFields = Object.entries(anime); // On récupère toutes les entrées de l'objet anime

//     return (
//         <div className="flex">
//             <div className="flex flex-col mr-32 min-w-96">
//                 <h3 className="text-xl font-semibold mb-4">Details</h3>
//                 <div className="space-y-4">
//                     {animeFields.map(([field, value]) => (
//                         <div
//                             key={field}
//                             className="flex items-center space-x-4"
//                         >
//                             <p className="text-gray-400 capitalize">
//                                 {field.replace(/([A-Z])/g, ' $1')}
//                             </p>
//                             <p>
//                                 {Array.isArray(value)
//                                     ? value.join(', ')
//                                     : value}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AnimeDetailsV2;
