import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer tous les producteurs distincts
    const producers = await Anime.aggregate([
      {
        $project: {
          producersArray: { $split: ["$Producers", ", "] }
        }
      },
      { $unwind: "$producersArray" },
      { $group: { _id: "$producersArray" } },
      { $sort: { _id: 1 } }
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
