import connectDB from '@/lib/db';
import Anime from '@/models/Anime';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    try {
        await connectDB();

        // Vérifier si l'utilisateur est connecté
        const token =
            req.headers.get('Authorization')?.split('Bearer ')[1] ||
            req.cookies.get('token')?.value;

        if (!token) {
            console.log('No token found.');
            return new Response('Unauthorized', { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        console.log('user:', user);

        if (!user) {
            console.log('User not found.');
            return new Response('Unauthorized', { status: 401 });
        }

        // Récupérer les données de la requête
        const { anime_id, review } = await req.json();

        if (!anime_id || !review) {
            return new Response('Anime ID and review data are required', {
                status: 400,
            });
        }

        const { score, summary, body } = review;

        if (!score || !summary || !body) {
            return new Response(
                'Review must include a score, summary, and body',
                { status: 400 }
            );
        }

        // Trouver l'animé par ID
        // const anime = await Anime.findOne({ anime_id });
        const anime = await Anime.findById(anime_id);
        if (!anime) {
            return new Response('Anime not found', { status: 404 });
        }

        // Ajouter la review
        const newReview = {
            id: Date.now(), // Vous pouvez utiliser une autre méthode pour générer un ID unique
            user: {
                id: user._id, // ID de l'utilisateur connecté
                email: user.email, // Email de l'utilisateur connecté
                name: user.name, // Nom de l'utilisateur connecté
                avatar: user.avatar, // Avatar de l'utilisateur connecté
            },
            score,
            summary,
            body,
        };

        anime.reviews.push(newReview);
        await anime.save();

        return new Response(
            JSON.stringify({
                message: 'Review added successfully',
                review: newReview,
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error adding review:', error);
        return new Response('Failed to add review', {
            status: 500,
        });
    }
};
