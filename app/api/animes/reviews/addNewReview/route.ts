import dbConnect from '@/lib/db';
import Anime from '@/models/Anime';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { animeId, userName, avatar, score, summary, body } = req.body;

    if (!animeId || !userName || !avatar || !score || !summary || !body) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Connect to the database
        await dbConnect();

        // Retrieve the anime by its animeId
        const anime = await Anime.findOne({ anime_id: animeId });

        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        // Create the review object
        const newReview = {
            user: { name: userName, avatar },
            score,
            summary,
            body,
            id: anime.reviews.length + 1, // Assign a new ID based on the current reviews length
        };

        // Add the review to the anime's reviews array
        anime.reviews.push(newReview);
        await anime.save();

        return res
            .status(200)
            .json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
