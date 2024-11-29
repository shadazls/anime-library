import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async (req) => {
  try {
    await connectDB();

    // Récupérer le paramètre 'author' de la requête
    const url = new URL(req.url);
    const author = url.searchParams.get('author'); // Paramètre 'author'

    if (!author) {
      return new Response('Author is required', { status: 400 });
    }

    // Rechercher les mangas dont l'auteur correspond à la valeur passée
    const mangasByAuthor = await Manga.find({ authors: { $in: [author] } })
      .select('title authors main_picture.medium -_id') // Sélectionner uniquement les champs pertinents
      .limit(6) // Limiter à 6 résultats
      .sort({ title: 1 }); // Trier par titre (ordre croissant)

    return new Response(JSON.stringify({ mangas: mangasByAuthor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch mangas by author', {
      status: 500,
    });
  }
};
