import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const GET = async (request) => {
    try {
        await connectDB();
        
        // Récupère les paramètres de la requête (page et limit)
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Par défaut page 1
        const limit = parseInt(url.searchParams.get('limit')) || 18; // Par défaut 10 éléments par page

        // Calcule le nombre de documents à ignorer
        const skip = (page - 1) * limit;

        // Récupère les animés avec pagination
        const animes = await Anime.find()
            .select('Name image_url -_id')
            .skip(skip)
            .limit(limit);

        // Récupère le nombre total d'animés pour connaître le nombre de pages
        const totalAnimes = await Anime.countDocuments();

        // Retourne les résultats et des informations de pagination
        return new Response(JSON.stringify({
            animes,
            totalAnimes,
            totalPages: Math.ceil(totalAnimes / limit),
            currentPage: page
        }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes', {
            status: 500,
        });
    }
};
