import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Anime from '@/models/Anime';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { anime_id, character } = req.body;

        if (!anime_id || !character) {
            return res
                .status(400)
                .json({ message: 'Missing anime ID or character data' });
        }

        try {
            await dbConnect();

            const anime = await Anime.findById(anime_id);
            if (!anime) {
                return res.status(404).json({ message: 'Anime not found' });
            }

            anime.staff = [...(anime.staff || []), character];
            await anime.save();

            res.status(200).json(character);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add character' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
