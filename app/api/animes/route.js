import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const GET = async (request) => {
    try {
        await connectDB();

        // Récupère les paramètres de la requête
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Par défaut, page 1
        const limit = parseInt(url.searchParams.get('limit')) || 18; // Par défaut, 18 éléments par page
        const nameQuery = url.searchParams.get('name') || ''; // Recherche par nom
        const genreQuery = url.searchParams.get('genre') || ''; // Recherche par genre
        const scoreQuery = parseFloat(url.searchParams.get('score')) || null; // Recherche par score
        const episodesQuery = parseInt(url.searchParams.get('episodes')) || null; // Recherche par nombre d'épisodes
        const statusQuery = url.searchParams.get('status') || ''; // Recherche par statut
        const ratingQuery = url.searchParams.get('rating') || ''; // Recherche par classification d'âge

        // Calcule le nombre de documents à ignorer
        const skip = (page - 1) * limit;

        // Construire le filtre de la requête
        const filter = {};
        if (nameQuery) {
            filter.Name = { $regex: nameQuery, $options: 'i' }; // Insensible à la casse
        }
        if (genreQuery) {
            filter.Genres = { $regex: genreQuery, $options: 'i' }; // Insensible à la casse
        }
        if (scoreQuery !== null) {
            filter.Score = { $gte: scoreQuery }; // Filtrage par score (minimum)
        }
        if (episodesQuery !== null) {
            filter.Episodes = episodesQuery; // Filtrage par nombre exact d'épisodes
        }
        if (statusQuery) {
            filter.Status = { $regex: statusQuery, $options: 'i' }; // Insensible à la casse
        }
        if (ratingQuery) {
            filter.Rating = { $regex: ratingQuery, $options: 'i' }; // Insensible à la casse
        }

        // Récupère les animés avec pagination et filtrage
        const animes = await Anime.find(filter)
            .select('Name image_url Genres Score Episodes Status Rating') // Inclure les champs requis
            .skip(skip)
            .limit(limit);

        // Récupère le nombre total d'animes pour la pagination
        const totalAnimes = await Anime.countDocuments(filter);

        // Retourne les résultats et des informations de pagination dans un format lisible
        return new Response(
            JSON.stringify({
                animes,               // Liste des animés filtrés
                pagination: {
                    totalAnimes,      // Nombre total d'animes correspondant au filtre
                    totalPages: Math.ceil(totalAnimes / limit), // Nombre total de pages
                    currentPage: page, // Page actuelle
                },
            }, null, 2), // Ajout de l'indentation pour améliorer la lisibilité
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json', // Définit le type MIME pour JSON
                },
            }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch animes' }, null, 2),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};
