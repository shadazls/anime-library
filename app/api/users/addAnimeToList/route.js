import connectDB from '@/lib/db';
import User from '@/models/User';

export const POST = async (request) => {
    try {
        // Connecte à la base de données
        await connectDB();

        // Récupère les données de la requête
        const { userId, animeId, listName } = await request.json();

        // Valide les données
        const validLists = [
            'to_watch',
            'watching',
            'watched',
            'rewatching',
            'abandoned',
        ];
        if (!validLists.includes(listName)) {
            return new Response(
                JSON.stringify({ message: 'Invalid list name' }),
                { status: 400 }
            );
        }

        // Vérifie l'existence de l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
            });
        }

        // Ajoute l'anime à la liste correspondante
        if (!user[listName].includes(animeId)) {
            user[listName].push(animeId);
            await user.save();
            return new Response(
                JSON.stringify({
                    message: `Anime ${animeId} added to ${listName}`,
                }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({
                    message: 'Anime already in list',
                }),
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error adding anime to list:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to add anime to list' }),
            { status: 500 }
        );
    }
};
