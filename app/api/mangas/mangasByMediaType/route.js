import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer les mangas dont le media_type est "light_novel"
        const mangasByMediaType = await Manga.find({
            media_type: 'light_novel', // Filtrer par media_type
        })
            .select('title media_type main_picture.medium') // Sélectionner les champs pertinents
            .sort({ title: 1 }) // Trier par titre par ordre alphabétique (ou autre critère)
            .limit(6); // Limiter à 6 résultats

        return new Response(JSON.stringify({ mangas: mangasByMediaType }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch mangas by media type', {
            status: 500,
        });
    }
};
