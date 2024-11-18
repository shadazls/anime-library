import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const GET = async (request) => {
    try {
        await connectDB();
        
        // Récupère les paramètres de la requête (page et limit)
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Par défaut page 1
        const limit = parseInt(url.searchParams.get('limit')) || 18; // Par défaut 18 éléments par page
        const nameQuery = url.searchParams.get('name') || ''; // Le paramètre name, si présent

        // Calcule le nombre de documents à ignorer
        const skip = (page - 1) * limit;

        // Construire le filtre de la requête
        const filter = nameQuery ? { Name: { $regex: nameQuery, $options: 'i' } } : {};

        // Récupère les animés avec pagination et filtrage par Name si nécessaire
        const animes = await Anime.find(filter)
            .select('Name image_url -_id')
            .skip(skip)
            .limit(limit);

        // Récupère le nombre total d'animés pour connaître le nombre de pages
        const totalAnimes = await Anime.countDocuments(filter);

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
