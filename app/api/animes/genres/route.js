import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer tous les genres distincts
    const genres = await Anime.aggregate([
      {
        $project: {
          genresArray: { $split: ["$Genres", ", "] }
        }
      },
      { $unwind: "$genresArray" },
      { $group: { _id: "$genresArray" } },
      { $sort: { _id: 1 } }
    ]);

    return new Response(JSON.stringify(genres), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch genres', {
      status: 500,
    });
  }
};