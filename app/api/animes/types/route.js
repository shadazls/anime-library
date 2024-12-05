import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer tous les types distincts
        const types = await Anime.aggregate([
            {
                $group: { _id: '$Type' }, // Regroupe par type d'anime
            },
            { $sort: { _id: 1 } }, // Trie les types par ordre alphabétique
        ]);

        return new Response(JSON.stringify(types), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch types', {
            status: 500,
        });
    }
};
