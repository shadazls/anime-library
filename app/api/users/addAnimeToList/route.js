import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const POST = async (request) => {
    try {
        console.log('Start adding anime to list...');

        // Connecte à la base de données
        await connectDB();
        console.log('Database connected successfully.');

        // Récupère le token dans les cookies ou les en-têtes Authorization
        const token =
            request.headers.get('Authorization')?.split('Bearer ')[1] ||
            request.cookies.get('token')?.value;

        console.log('Token retrieved:', token);

        if (!token) {
            console.log('No token found.');
            return new Response('Unauthorized', { status: 401 });
        }

        // Vérifie et décode le JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Récupère les informations de l'utilisateur à partir de l'ID décodé
        const user = await User.findById(decoded.userId);
        console.log('User found:', user);

        if (!user) {
            console.log('User not found.');
            return new Response('Unauthorized', { status: 401 });
        }

        // Récupère les données de la requête
        const { animeId, listName } = await request.json();
        console.log('Request body:', { animeId, listName });

        // Valide les données
        const validLists = [
            'to_watch',
            'watching',
            'watched',
            'rewatching',
            'abandoned',
        ];

        if (!validLists.includes(listName)) {
            console.log('Invalid list name:', listName);
            return new Response('Invalid list name', { status: 400 });
        }

        // Ajoute l'anime à la liste correspondante
        if (!user[listName].includes(animeId)) {
            console.log(`Adding anime ${animeId} to ${listName}`);
            user[listName].push(animeId);
            await user.save();
            console.log('Anime added to list successfully.');
            return new Response(
                JSON.stringify({
                    message: `Anime ${animeId} added to ${listName}`,
                }),
                { status: 200 }
            );
        } else {
            console.log('Anime already in list.');
            return new Response('Anime already in list', { status: 200 });
        }
    } catch (error) {
        console.error('Error in addAnimeToList:', error);
        return new Response('Failed to add anime to list', { status: 500 });
    }
};
