import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const PUT = async (req) => {
  try {
    // Connecte à la base de données
    await connectDB();

    // Récupère l'ID et les données à mettre à jour depuis la requête
    const url = new URL(req.url);
    const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

    if (!id) {
      return new Response('Manga ID is required', { status: 400 });
    }

    const body = await req.json(); // Récupérer les données envoyées avec la requête

    if (!body || Object.keys(body).length === 0) {
      return new Response('No data provided for update', { status: 400 });
    }

    // Mettre à jour le manga avec les nouvelles données
    const updatedManga = await Manga.findByIdAndUpdate(id, body, { new: true });

    if (!updatedManga) {
      return new Response('Manga not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedManga), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating manga:', error);
    return new Response('Failed to update manga', {
      status: 500,
    });
  }
};
