interface AnimeDetailsProps {
    anime: {
        Type: string;
        Episodes: number;
        Genres: string[];
        Aired: string;
        Status: string;
        Premiered: string;
        Producers: string[];
        Licensors: string[];
        Studios: string[];
        Source: string;
        Duration: string;
        Rating: string;
        Rank: number;
        Popularity: number;
        Favorites: number;
        Members: number;
    };
}

const AnimeDetails = ({ anime }: AnimeDetailsProps) => {
    return (
        <div className="flex">
            <div className="flex flex-col mr-32 min-w-96">
                <h3 className="text-xl font-semibold mb-4">Details</h3>
                <div className="flex gap-8">
                    {/* TODO: Régler le problème d'écart entre les lignes lorsqu'un champ est trop long et prend plusieurs lignes, au lieu de faire 2 colonnes, faire pleins de lignes */}
                    <ul className="space-y-2">
                        <li>
                            <p className="text-gray-400">Type</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Episodes</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Genres</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Aired</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Status</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Premiered</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Producers</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Licensors</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Studios</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Source</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Duration</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Rating</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Rank</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Popularity</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Favorites</p>
                        </li>
                        <li>
                            <p className="text-gray-400">Members</p>
                        </li>
                    </ul>
                    <ul className="space-y-2">
                        <li>
                            <p>{anime.Type}</p>
                        </li>
                        <li>
                            <p>{anime.Episodes}</p>
                        </li>
                        <li>
                            <p>{anime.Genres.join(', ')}</p>
                        </li>
                        <li>
                            <p>{anime.Aired}</p>
                        </li>
                        <li>
                            <p>{anime.Status}</p>
                        </li>
                        <li>
                            <p>{anime.Premiered}</p>
                        </li>
                        <li>
                            <p>{anime.Producers.join(', ')}</p>
                        </li>
                        <li>
                            <p>{anime.Licensors.join(', ')}</p>
                        </li>
                        <li>
                            <p>{anime.Studios.join(', ')}</p>
                        </li>
                        <li>
                            <p>{anime.Source}</p>
                        </li>
                        <li>
                            <p>{anime.Duration}</p>
                        </li>
                        <li>
                            <p>{anime.Rating}</p>
                        </li>
                        <li>
                            <p>{anime.Rank}</p>
                        </li>
                        <li>
                            <p>{anime.Popularity}</p>
                        </li>
                        <li>
                            <p>{anime.Favorites}</p>
                        </li>
                        <li>
                            <p>{anime.Members}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetails;
