import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const duration = url.searchParams.get('duration'); // Récupérer la durée
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Limite par défaut à 6

    if (!duration) {
      return new Response('Duration is required', { status: 400 });
    }

    // Rechercher les animés avec la durée spécifiée
    const animesByDuration = await Anime.find({ Duration: duration })
      .select('Name image_url Duration -_id')
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByDuration }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by duration', { status: 500 });
  }
};
