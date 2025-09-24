import connectDB from '../../../../lib/db';
import Anime from '../../../../models/Anime';

export const POST = async (request) => {
    try {
        // Connecte à la base de données
        await connectDB();

        // Récupère les données envoyées dans le corps de la requête
        const body = await request.json();

        // Valide les données obligatoires
        const { Name, image_url } = body;
        if (!Name || !image_url) {
            return new Response(
                JSON.stringify({ message: 'Name and image_url are required.' }),
                {
                    status: 400,
                }
            );
        }

        // Récupère l'ID le plus élevé actuel de anime_id
        const highestAnime = await Anime.findOne()
            .sort({ anime_id: -1 })
            .limit(1);

        // Si un anime existe déjà, incrémente l'anime_id
        const newAnimeId = highestAnime ? highestAnime.anime_id + 1 : 1; // Si aucun anime n'est trouvé, commence à 1

        // Ajoute l'anime_id au corps de la requête
        const newAnimeData = { ...body, anime_id: newAnimeId };

        // Crée un nouvel animé avec les données mises à jour
        const newAnime = new Anime(newAnimeData);

        // Sauvegarde l'animé dans la base de données
        await newAnime.save();

        // Retourne une réponse de succès
        return new Response(
            JSON.stringify({
                message: 'Anime added successfully!',
                anime: newAnime,
            }),
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error('Error adding anime:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to add anime.' }),
            {
                status: 500,
            }
        );
    }
};
