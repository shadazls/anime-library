import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer tous les producteurs distincts
        const producers = await Anime.aggregate([
            {
                $project: {
                    producersArray: {
                        $cond: {
                            if: { $isArray: '$Producers' }, // Si Producers est déjà un tableau
                            then: '$Producers', // Utiliser directement le tableau
                            else: { $split: ['$Producers', ', '] }, // Sinon, le transformer en tableau
                        },
                    },
                },
            },
            { $unwind: '$producersArray' },
            { $group: { _id: '$producersArray' } },
            { $sort: { _id: 1 } },
        ]);

        return new Response(JSON.stringify(producers), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch producers', {
            status: 500,
        });
    }
};
