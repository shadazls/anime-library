import connectDB from '@/lib/db';
import Anime from '@/models/Anime';
import jwt from 'jsonwebtoken';

export const DELETE = async (req) => {
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
        console.log('Decoded:', decoded);

        // Récupérer les données de la requête
        const url = new URL(req.url);
        const animeId = url.searchParams.get('anime_id');
        const reviewId = url.searchParams.get('review_id');

        if (!animeId || !reviewId) {
            return new Response('Anime ID and Review ID are required', {
                status: 400,
            });
        }

        // Trouver l'animé par ID
        const anime = await Anime.findById(animeId);
        if (!anime) {
            return new Response('Anime not found', { status: 404 });
        }

        // Trouver la review à supprimer
        const reviewIndex = anime.reviews.findIndex(
            (review) => review.id === parseInt(reviewId)
        );

        if (reviewIndex === -1) {
            return new Response('Review not found', { status: 404 });
        }

        // Vérifier que l'utilisateur connecté est l'auteur de la review
        const review = anime.reviews[reviewIndex];
        if (review.user.email !== decoded.email) {
            return new Response(
                'Forbidden: You can only delete your own reviews',
                {
                    status: 403,
                }
            );
        }

        // Supprimer la review
        anime.reviews.splice(reviewIndex, 1);
        await anime.save();

        return new Response(
            JSON.stringify({ message: 'Review deleted successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error deleting review:', error);
        return new Response('Failed to delete review', {
            status: 500,
        });
    }
};
