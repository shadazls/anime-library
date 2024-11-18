import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const studio = url.searchParams.get('studio'); // Récupérer le nom du studio
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 10

    if (!studio) {
      return new Response('Studio is required', { status: 400 });
    }

    // Rechercher les animés contenant le studio dans la liste des studios
    const animesByStudio = await Anime.find({ Studios: new RegExp(studio, 'i') })
      .select('Name image_url Studios -_id') // Sélectionner uniquement les champs nécessaires
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByStudio }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by studio', {
      status: 500,
    });
  }
};
