import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const GET = async () => {
    try {
        await connectDB();
    
        // Récupère les champs "name" et "Image URL", exclut "_id"
        const animes = await Anime.find().select('Name image_url -_id');
    
        return new Response(JSON.stringify(animes), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes', {
            status: 500,
        });
    }
};