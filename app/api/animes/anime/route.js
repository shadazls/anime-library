import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

        if (!id) {
            return new Response('Anime ID is required', { status: 400 });
        }

        // Rechercher l'anime dans la base de données
        const anime = await Anime.findById(id);

        if (!anime) {
            return new Response('Anime not found', { status: 404 });
        }

        // Retourner l'anime trouvé en réponse
        return new Response(JSON.stringify(anime), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to retrieve anime', {
            status: 500,
        });
    }
};
