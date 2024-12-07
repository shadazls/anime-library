import User from '@/models/User';
import Anime from '@/models/anime'; // Importez le modèle Anime
import connectDB from '../../../../lib/db';

export const GET = async (req) => {
    try {
        await connectDB();

        // Récupérer le paramètre "name" depuis la query string de l'URL
        const url = new URL(req.url);
        const name = url.searchParams.get('name'); // Récupérer le nom passé comme paramètre

        if (!name) {
            return new Response('Name parameter is required', { status: 400 });
        }

        // Recherche l'utilisateur dans la base de données en utilisant son nom
        const user = await User.findOne({ name })
            .populate({
                path: 'to_watch',
                model: Anime, // Assurez-vous que cette référence correspond au modèle Anime
            })
            .populate({
                path: 'watching',
                model: Anime,
            })
            .populate({
                path: 'watched',
                model: Anime,
            })
            .populate({
                path: 'rewatching',
                model: Anime,
            })
            .populate({
                path: 'abandoned',
                model: Anime,
            });

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        // Retourner les données de l'utilisateur sous forme de JSON
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching user by name:', error);
        return new Response('Failed to fetch user', { status: 500 });
    }
};
