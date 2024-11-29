import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const licensor = url.searchParams.get('licensor'); // Récupérer le nom du distributeur
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 10

    if (!licensor) {
      return new Response('Licensor is required', { status: 400 });
    }

    // Rechercher les animés contenant le distributeur dans la liste des distributeurs
    const animesByLicensor = await Anime.find({ Licensors: new RegExp(licensor, 'i') })
      .select('Name image_url Licensors') // Sélectionner uniquement les champs nécessaires
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByLicensor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by licensor', {
      status: 500,
    });
  }
};
