import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const year = url.searchParams.get('year'); // Récupérer l'année passée en paramètre
    const limit = parseInt(url.searchParams.get('limit'), 10) || 6; // Par défaut, limite à 6

    if (!year) {
      return new Response('Year is required', { status: 400 });
    }

    // Créer un intervalle de dates pour l'année spécifiée
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    // Rechercher les mangas dont la date de début (`start_date`) est dans l'année spécifiée
    const mangasByStartDate = await Manga.find({
      start_date: { $gte: startOfYear, $lte: endOfYear },
    })
      .select('title main_picture.medium start_date -_id') // Sélectionner uniquement les champs pertinents
      .limit(limit);

    return new Response(JSON.stringify({ mangas: mangasByStartDate }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by start date', {
      status: 500,
    });
  }
};
