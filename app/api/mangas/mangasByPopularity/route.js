import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer les mangas avec un champ popularity numérique valide et les trier par ordre croissant
    const mangasByPopularity = await Manga.find({
      popularity: { $type: "number" }, // Filtrer uniquement les popularités numériques
    })
      .select('title popularity main_picture.medium -_id') // Sélectionner uniquement les champs pertinents
      .sort({ popularity: 1 }) // Trier par popularité croissante
      .limit(6); // Limiter à 6 résultats

    return new Response(JSON.stringify({ mangas: mangasByPopularity }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by popularity', {
      status: 500,
    });
  }
};
