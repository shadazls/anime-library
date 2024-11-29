import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
  try {
    await connectDB();

    // Récupérer les mangas avec nsfw égal à "gray"
    const mangasByNsfw = await Manga.find({ nsfw: "gray" }) // Filtrer par nsfw = "gray"
      .select('title nsfw main_picture.medium -_id') // Sélectionner uniquement les champs pertinents
      .limit(6); // Limiter à 6 résultats

    return new Response(JSON.stringify({ mangas: mangasByNsfw }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by nsfw', {
      status: 500,
    });
  }
};
