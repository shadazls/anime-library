import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async () => {
    try {
        await connectDB();

        // Récupérer les mangas avec un score numérique valide et inférieur ou égal à 10
        const mangasByScore = await Manga.find({
            mean: { $type: 'number', $lte: 10 }, // Filtrer uniquement les scores numériques ≤ 10
        })
            .select('title mean main_picture.medium -_id') // Sélectionner uniquement les champs pertinents
            .sort({ mean: -1 }) // Trier par score décroissant
            .limit(6); // Limiter à 6 résultats

        return new Response(JSON.stringify({ mangas: mangasByScore }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch mangas by score', {
            status: 500,
        });
    }
};
