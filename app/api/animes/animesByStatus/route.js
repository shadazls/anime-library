import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const status = url.searchParams.get('status'); // Récupérer le statut passé en paramètre
        const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 10

        if (!status) {
            return new Response('Status is required', { status: 400 });
        }

        // Rechercher les animés avec le statut correspondant
        const animesByStatus = await Anime.find({ Status: status })
            .select('Name image_url Status') // Sélectionner uniquement les champs nécessaires
            .limit(limit);

        return new Response(JSON.stringify({ animes: animesByStatus }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by status', {
            status: 500,
        });
    }
};
