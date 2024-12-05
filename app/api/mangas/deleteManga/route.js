import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const DELETE = async (req) => {
    try {
        // Connecte à la base de données
        await connectDB();

        // Récupère l'ID du manga à supprimer depuis les paramètres de requête
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

        if (!id) {
            return new Response('Manga ID is required', { status: 400 });
        }

        // Supprime le manga correspondant à l'ID
        const deletedManga = await Manga.findByIdAndDelete(id);

        if (!deletedManga) {
            return new Response('Manga not found', { status: 404 });
        }

        return new Response('Manga deleted successfully', { status: 200 });
    } catch (error) {
        console.error('Error deleting manga:', error);
        return new Response('Failed to delete manga', {
            status: 500,
        });
    }
};
