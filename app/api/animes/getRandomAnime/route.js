import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const GET = async () => {
    try {
        await connectDB();

        // Compter le nombre total d'animes dans la collection
        const count = await Anime.countDocuments();

        if (count === 0) {
            return new Response('No animes available', { status: 404 });
        }

        // Générer un index aléatoire
        const randomIndex = Math.floor(Math.random() * count);

        // Récupérer un anime aléatoire basé sur l'index
        const randomAnime = await Anime.findOne().skip(randomIndex);

        if (!randomAnime) {
            return new Response('Failed to retrieve random anime', {
                status: 500,
            });
        }

        // Retourner l'anime trouvé en réponse
        return new Response(JSON.stringify(randomAnime), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to retrieve random anime', {
            status: 500,
        });
    }
};
