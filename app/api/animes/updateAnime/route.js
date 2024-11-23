import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const PUT = async (req) => {
  try {
    await connectDB();

    // Récupérer l'ID et les données à mettre à jour depuis la requête
    const url = new URL(req.url);
    const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

    if (!id) {
      return new Response('Anime ID is required', { status: 400 });
    }

    const body = await req.json(); // Récupérer les données envoyées avec la requête

    if (!body || Object.keys(body).length === 0) {
      return new Response('No data provided for update', { status: 400 });
    }

    // Mettre à jour l'animé avec les nouvelles données
    const updatedAnime = await Anime.findByIdAndUpdate(id, body, { new: true });

    if (!updatedAnime) {
      return new Response('Anime not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedAnime), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update anime', {
      status: 500,
    });
  }
};
