import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const rating = url.searchParams.get('rating'); // Récupérer la classification d'âge
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Limite par défaut à 6

    if (!rating) {
      return new Response('Rating is required', { status: 400 });
    }

    // Rechercher les animés avec la classification d'âge spécifiée
    const animesByRating = await Anime.find({ Rating: new RegExp(rating, 'i') })
      .select('Name image_url Rating -_id')
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByRating }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by rating', { status: 500 });
  }
};
