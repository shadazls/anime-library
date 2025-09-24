import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer tous les licensors distincts
        const licensors = await Anime.aggregate([
            {
                $project: {
                    licensorsArray: { $split: ['$Licensors', ', '] },
                },
            },
            { $unwind: '$licensorsArray' },
            { $group: { _id: '$licensorsArray' } },
            { $sort: { _id: 1 } },
        ]);

        return new Response(JSON.stringify(licensors), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch licensors', {
            status: 500,
        });
    }
};
