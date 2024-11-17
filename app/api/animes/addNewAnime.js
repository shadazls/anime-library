import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const POST = async (request) => {
    try {
        // Connecte à la base de données
        await connectDB();

        // Récupère les données envoyées dans le corps de la requête
        const body = await request.json();

        // Valide les données obligatoires
        const { Name, image_url } = body;
        if (!Name || !image_url) {
            return new Response(JSON.stringify({ message: 'Name and image_url are required.' }), {
                status: 400,
            });
        }

        // Crée un nouvel animé avec les données reçues
        const newAnime = new Anime(body);

        // Sauvegarde l'animé dans la base de données
        await newAnime.save();

        // Retourne une réponse de succès
        return new Response(JSON.stringify({ message: 'Anime added successfully!', anime: newAnime }), {
            status: 201,
        });
    } catch (error) {
        console.error('Error adding anime:', error);
        return new Response(JSON.stringify({ message: 'Failed to add anime.' }), {
            status: 500,
        });
    }
};
