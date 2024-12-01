import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const producer = url.searchParams.get('producer'); // Récupérer le nom du producteur
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 10

    if (!producer) {
      return new Response('Producer is required', { status: 400 });
    }

    // Rechercher les animés contenant le producteur dans la liste des producteurs
    const animesByProducer = await Anime.find({ Producers: new RegExp(producer, 'i') })
      .select('Name image_url Producers') // Sélectionner uniquement les champs nécessaires
      .limit(limit);

    return new Response(JSON.stringify({ animes: animesByProducer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch animes by producer', {
      status: 500,
    });
  }
};
