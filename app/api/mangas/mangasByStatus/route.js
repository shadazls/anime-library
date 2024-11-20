import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer les mangas dont le status est "finished"
    const mangasByStatus = await Manga.find({
      status: 'finished', // Filtrer par status
    })
      .select('title status main_picture.medium -_id') // Sélectionner les champs pertinents
      .sort({ title: 1 }) // Trier par titre par ordre alphabétique
      .limit(6); // Limiter à 6 résultats

    return new Response(JSON.stringify({ mangas: mangasByStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by status', {
      status: 500,
    });
  }
};
