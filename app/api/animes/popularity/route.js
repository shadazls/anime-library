import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const GET = async () => {
    try {
        await connectDB();

        const animesByPopularity = await Anime.find()
            .select('Name Popularity image_url')
            .sort({ Popularity: -1 })
            .limit(6);

        return new Response(JSON.stringify(animesByPopularity), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch animes by popularity', {
            status: 500,
        });
    }
};
