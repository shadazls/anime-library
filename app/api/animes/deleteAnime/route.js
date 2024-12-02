import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const DELETE = async (req) => {
    try {
        // Connecte à la base de données
        await connectDB();

        // Récupérer les paramètres de la requête
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

        if (!id) {
            return new Response('Anime ID is required', { status: 400 });
        }

        // Supprimer l'animé correspondant à l'ID
        const deletedAnime = await Anime.findByIdAndDelete(id);

        if (!deletedAnime) {
            return new Response('Anime not found', { status: 404 });
        }

        return new Response('Anime deleted successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to delete anime', {
            status: 500,
        });
    }
};
