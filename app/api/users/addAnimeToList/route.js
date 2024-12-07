import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const POST = async (request) => {
    try {
        console.log('Start adding anime to list...');

        // Connecte à la base de données
        await connectDB();

        // Récupère le token dans les cookies ou les en-têtes Authorization
        const token =
            request.headers.get('Authorization')?.split('Bearer ')[1] ||
            request.cookies.get('token')?.value;

        if (!token) {
            console.log('No token found.');
            return new Response('Unauthorized', { status: 401 });
        }

        // Vérifie et décode le JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupère les informations de l'utilisateur à partir de l'ID décodé
        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log('User not found.');
            return new Response('Unauthorized', { status: 401 });
        }

        // Récupère les données de la requête
        const { animeId, listName } = await request.json();

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

        // Vérifier si l'anime est déjà dans une autre liste
        const existingList = validLists.find((list) => {
            console.log(`Checking list: ${list}`);
            console.log('List contents:', user[list]);
            const exists = user[list].some(
                (id) => String(id) === String(animeId)
            ); // Convertir les ID en String si nécessaire
            console.log(`Anime ${animeId} exists in ${list}:`, exists);
            return exists;
        });

        const animeObjectId = new mongoose.Types.ObjectId(animeId);

        if (existingList) {
            // Si l'anime est trouvé dans une autre liste, le retirer de cette liste
            console.log(
                `Anime ${animeId} found in ${existingList}. Removing it from that list.`
            );
            user[existingList] = user[existingList].filter(
                (id) => id.toString() !== animeObjectId.toString()
            );
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
