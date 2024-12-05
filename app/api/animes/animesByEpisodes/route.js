import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
    try {
        await connectDB();

        const url = new URL(req.url);
        const episodes = parseFloat(url.searchParams.get('episodes')); // Conversion explicite en Float
        const limit = parseInt(url.searchParams.get('limit'), 10) || 6;

        if (isNaN(episodes)) {
            return new Response('Episodes must be a valid number', {
                status: 400,
            });
        }

        // Rechercher les animes avec des Episodes valides et correspondant à la valeur spécifiée
        const animesByEpisodes = await Anime.find({
            $and: [
                { Episodes: { $type: 'double' } }, // Vérifie que le champ est de type numérique
                { Episodes: episodes }, // Compare à la valeur recherchée
            ],
        })
            .select('Name image_url Episodes')
            .limit(limit);

        return new Response(JSON.stringify({ animes: animesByEpisodes }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by episodes', {
            status: 500,
        });
    }
};
