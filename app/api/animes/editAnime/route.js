import connectDB from '../../../../lib/db';
import Anime from '../../../../models/anime';

export const PUT = async (req) => {
    try {
        await connectDB();

        // Récupérer l'ID et les données à mettre à jour depuis la requête
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

        if (!id) {
            return new Response('Anime ID is required', { status: 400 });
        }

        const body = await req.json(); // Récupérer les données envoyées avec la requête

        if (!body || Object.keys(body).length === 0) {
            return new Response('No data provided for update', { status: 400 });
        }

        // Mettre à jour l'animé avec les nouvelles données
        const updatedAnime = await Anime.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (!updatedAnime) {
            return new Response('Anime not found', { status: 404 });
        }

        // Structurer le retour pour inclure seulement les champs nécessaires
        const responseAnime = {
            id: updatedAnime._id,
            anime_id: updatedAnime.anime_id,
            Name: updatedAnime.Name,
            english_name: updatedAnime.english_name,
            other_name: updatedAnime.other_name,
            Score: updatedAnime.Score,
            Genres: updatedAnime.Genres,
            Synopsis: updatedAnime.Synopsis,
            Type: updatedAnime.Type,
            Episodes: updatedAnime.Episodes,
            Aired: updatedAnime.Aired,
            Premiered: updatedAnime.Premiered,
            Status: updatedAnime.Status,
            Producers: updatedAnime.Producers,
            Licensors: updatedAnime.Licensors,
            Studios: updatedAnime.Studios,
            Source: updatedAnime.Source,
            Duration: updatedAnime.Duration,
            Rating: updatedAnime.Rating,
            Rank: updatedAnime.Rank,
            Popularity: updatedAnime.Popularity,
            Favorites: updatedAnime.Favorites,
            scored_by: updatedAnime.scored_by,
            Members: updatedAnime.Members,
            image_url: updatedAnime.image_url,
            trailer_url: updatedAnime.trailer_url,
            characters: updatedAnime.characters,
            reviews: updatedAnime.reviews,
            streamingEpisodes: updatedAnime.streamingEpisodes,
            relations: updatedAnime.relations,
        };

        return new Response(JSON.stringify({ anime: responseAnime }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to update anime', {
            status: 500,
        });
    }
};
