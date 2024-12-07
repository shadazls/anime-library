import connectDB from '../../../lib/db';
import Anime from '../../../models/anime';

export const GET = async (request) => {
    try {
        await connectDB();

        // Récupère les paramètres de la requête
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Par défaut, page 1
        const limit = parseInt(url.searchParams.get('limit')) || 18; // Par défaut, 18 éléments par page

        const nameQuery = url.searchParams.get('name') || ''; 
        const genreQuery = url.searchParams.get('genre') || ''; 
        const scoreQuery = parseFloat(url.searchParams.get('score')) || null; 
        const episodesQuery = parseInt(url.searchParams.get('episodes')) || null; 
        const statusQuery = url.searchParams.get('status') || ''; 
        const ratingQuery = url.searchParams.get('rating') || ''; 
        const producersQuery = url.searchParams.get('producers') || '';
        const licensorsQuery = url.searchParams.get('licensors') || '';
        const typeQuery = url.searchParams.get('type') || '';
        const studiosQuery = url.searchParams.get('studios') || '';
        const sourceQuery = url.searchParams.get('source') || '';
        const durationQuery = url.searchParams.get('duration') || '';
        const airedQuery = url.searchParams.get('aired') || '';
        const premieredQuery = url.searchParams.get('premiered') || '';
        const rankQuery = parseInt(url.searchParams.get('rank')) || null;
        const favoritesQuery = parseInt(url.searchParams.get('favorites')) || null;
        const scoredByQuery = parseInt(url.searchParams.get('scoredBy')) || null;
        const membersQuery = parseInt(url.searchParams.get('members')) || null;

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
            filter.Score = { $gte: scoreQuery }; // Score minimum
        }
        if (episodesQuery !== null) {
            filter.Episodes = episodesQuery; // Nombre exact d'épisodes
        }
        if (statusQuery) {
            filter.Status = { $regex: statusQuery, $options: 'i' }; 
        }
        if (ratingQuery) {
            filter.Rating = { $regex: ratingQuery, $options: 'i' }; 
        }
        if (producersQuery) {
            filter.Producers = { $regex: producersQuery, $options: 'i' }; 
        }
        if (licensorsQuery) {
            filter.Licensors = { $regex: licensorsQuery, $options: 'i' };
        }
        if (typeQuery) {
            filter.Type = { $regex: typeQuery, $options: 'i' }; 
        }
        if (studiosQuery) {
            filter.Studios = { $regex: studiosQuery, $options: 'i' }; 
        }
        if (sourceQuery) {
            filter.Source = { $regex: sourceQuery, $options: 'i' }; 
        }
        if (durationQuery) {
            filter.Duration = { $regex: durationQuery, $options: 'i' }; 
        }
        if (airedQuery) {
            filter.Aired = { $regex: airedQuery, $options: 'i' }; 
        }
        if (premieredQuery) {
            filter.Premiered = { $regex: premieredQuery, $options: 'i' }; 
        }
        if (rankQuery !== null) {
            filter.Rank = { $lte: rankQuery }; // Classement maximum
        }
        if (favoritesQuery !== null) {
            filter.Favorites = { $gte: favoritesQuery }; // Nombre de favoris minimum
        }
        if (scoredByQuery !== null) {
            filter.ScoredBy = { $gte: scoredByQuery }; // Nombre minimum d'évaluateurs
        }
        if (membersQuery !== null) {
            filter.Members = { $gte: membersQuery }; // Nombre minimum de membres
        }

        // Log the constructed filter
        console.log("Filters received from frontend:", filter);

        // Récupère les animés avec pagination et filtrage
        const animes = await Anime.find(filter)
            .select('Name image_url Genres Score Episodes Status Rating Producers Licensors Type Studios Source Duration Aired Premiered Rank Favorites ScoredBy Members') 
            .skip(skip)
            .limit(limit);

        // Log the results of the query
        console.log("Filtered animes from MongoDB:", animes);

        // Récupère le nombre total d'animes pour la pagination
        const totalAnimes = await Anime.countDocuments(filter);


        // Retourne les résultats et des informations de pagination
        return new Response(
            JSON.stringify({
                animes,
                pagination: {
                    totalAnimes,
                    totalPages: Math.ceil(totalAnimes / limit),
                    currentPage: page,
                },
            }, null, 2),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
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
