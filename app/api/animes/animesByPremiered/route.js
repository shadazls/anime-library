import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const year = url.searchParams.get('year'); // Récupérer l'année passée en paramètre
        const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 6

        if (!year) {
            return new Response('Year is required', { status: 400 });
        }

        // Rechercher les animés dont l'année correspond dans le champ Premiered
        const regex = new RegExp(`\\b${year}\\b`, 'i'); // Regex pour correspondre uniquement à l'année
        const animesByYear = await Anime.find({ Premiered: { $regex: regex } })
            .select('Name image_url Premiered') // Sélectionner uniquement les champs pertinents
            .limit(limit);

        return new Response(JSON.stringify({ animes: animesByYear }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by year', {
            status: 500,
        });
    }
};
