import connectDB from '../../../../lib/db';
import Manga from '../../../../models/manga';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer l'année passée en paramètre
        const url = new URL(req.url);
        const year = url.searchParams.get('year'); // Récupérer l'année depuis l'URL

        if (!year) {
            return new Response('Year is required', { status: 400 });
        }

        // Créer une plage de dates pour l'année donnée
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

        // Récupérer les mangas créés durant l'année spécifiée
        const mangasByYear = await Manga.find({
            created_at: {
                $gte: startOfYear, // Date de début de l'année
                $lte: endOfYear, // Date de fin de l'année
            },
        })
            .select('title created_at main_picture.medium -_id') // Sélectionner les champs pertinents
            .sort({ created_at: 1 }) // Trier par date de création croissante
            .limit(6); // Limiter à 6 résultats

        return new Response(JSON.stringify({ mangas: mangasByYear }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch mangas by year', {
            status: 500,
        });
    }
};
