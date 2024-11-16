import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
    try {
        await connectDB();

        const animesByFavorites = await Anime.find()
            .select('Name Favorites image_url -_id')
            .sort({ Favorites: -1 })
            .limit(6);

        return new Response(JSON.stringify(animesByFavorites), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by rank', {
            status: 500,
        });
    }
};