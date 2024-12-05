import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer les mangas dont le nombre de volumes est supérieur à 50
        const mangasByNumVolumes = await Manga.find({
            num_volumes: { $gt: 50 }, // Filtrer les mangas avec plus de 50 volumes
        })
            .select('title num_volumes main_picture.medium') // Sélectionner les champs pertinents
            .sort({ num_volumes: 1 }) // Trier par nombre de volumes (ordre croissant)
            .limit(6); // Limiter à 6 résultats

        return new Response(JSON.stringify({ mangas: mangasByNumVolumes }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch mangas by num_volumes', {
            status: 500,
        });
    }
};
