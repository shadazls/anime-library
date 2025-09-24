import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const source = url.searchParams.get('source'); // Récupérer la source
        const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Limite par défaut à 6

        if (!source) {
            return new Response('Source is required', { status: 400 });
        }

        // Rechercher les animés ayant la source spécifiée
        const animesBySource = await Anime.find({
            Source: new RegExp(source, 'i'),
        })
            .select('Name image_url Source')
            .limit(limit);

        return new Response(JSON.stringify({ animes: animesBySource }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by source', {
            status: 500,
        });
    }
};
