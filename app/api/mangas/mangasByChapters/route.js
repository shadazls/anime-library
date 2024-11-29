import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer les mangas dont le nombre de chapitres est supérieur à 500
    const mangasByNumChapters = await Manga.find({
      num_chapters: { $gt: 500 }, // Filtrer les mangas avec plus de 500 chapitres
    })
      .select('title num_chapters main_picture.medium -_id') // Sélectionner les champs pertinents
      .sort({ num_chapters: 1 }) // Trier par nombre de chapitres (ordre croissant)
      .limit(6);
    return new Response(JSON.stringify({ mangas: mangasByNumChapters }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by num_chapters', {
      status: 500,
    });
  }
};
