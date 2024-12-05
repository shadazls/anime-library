import connectDB from '../../../lib/db';
import Manga from '../../../models/manga';

export const GET = async (request) => {
    try {
        await connectDB();

        // Récupère les paramètres de la requête (page et limit)
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Par défaut page 1
        const limit = parseInt(url.searchParams.get('limit')) || 18; // Par défaut 18 éléments par page
        const titleQuery = url.searchParams.get('title') || ''; // Recherche par titre

        // Construire le filtre de la requête
        const filter = {};
        if (titleQuery) {
            filter.title = { $regex: titleQuery, $options: 'i' }; // Insensible à la casse
        }

        // Calcule le nombre de documents à ignorer
        const skip = (page - 1) * limit;

        // Récupère les mangas avec pagination
        const mangas = await Manga.find(filter)
            .select('title main_picture.medium') // Sélectionne les champs pertinents
            .skip(skip)
            .limit(limit);

        // Récupère le nombre total de mangas pour connaître le nombre de pages
        const totalMangas = await Manga.countDocuments();

        // Retourne les résultats et des informations de pagination
        return new Response(
            JSON.stringify({
                mangas,
                totalMangas,
                totalPages: Math.ceil(totalMangas / limit),
                currentPage: page,
            }),
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch mangas', {
            status: 500,
        });
    }
};
