import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
    try {
        await connectDB();

        const animesByScore = await Anime.find({ Score: { $type: "number" } }) // Ne garder que les scores numériques (enlever les champs "UNKNOWN")
            .select('Name Score image_url')
            .sort({ Score: -1 })
            .limit(6);

        return new Response(JSON.stringify(animesByScore), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by score', {
            status: 500,
        });
    }
};
