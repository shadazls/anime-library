import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer les mangas avec un champ rank numérique valide et les trier par ordre croissant
    const mangasByRank = await Manga.find({
      rank: { $type: "number" }, // Filtrer uniquement les rangs numériques
    })
      .select('title rank main_picture.medium -_id') // Sélectionner uniquement les champs pertinents
      .sort({ rank: 1 }) // Trier par rang croissant
      .limit(6); // Limiter à 6 résultats

    return new Response(JSON.stringify({ mangas: mangasByRank }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by rank', {
      status: 500,
    });
  }
};
