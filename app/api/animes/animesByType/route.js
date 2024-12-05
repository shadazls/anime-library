import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const type = url.searchParams.get('type'); // Récupérer le type passé comme paramètre
        const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 6

        if (!type) {
            return new Response('Type is required', { status: 400 });
        }

        const animesByType = await Anime.find({ Type: type })
            .select('Name image_url Type')
            .limit(limit);

        return new Response(JSON.stringify({ animes: animesByType }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by type', {
            status: 500,
        });
    }
};
