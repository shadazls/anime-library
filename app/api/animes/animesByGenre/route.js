import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const genre = url.searchParams.get('genre'); // Récupérer le genre passé comme paramètre
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 6

    if (!genre) {
      return new Response('Genre is required', { status: 400 });
    }

    const animesByGenre = await Anime.find({ Genres: genre })
      .select('Name image_url Genres -_id')
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByGenre }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by genre', {
      status: 500,
    });
  }
};
