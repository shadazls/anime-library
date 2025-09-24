import connectDB from '@/lib/db';
import Anime from '@/models/Anime';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { anime_id, character } = await req.json();

    if (!anime_id || !character) {
        return NextResponse.json(
            { message: 'Missing anime ID or character data' },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        const anime = await Anime.findById(anime_id);
        if (!anime) {
            return NextResponse.json(
                { message: 'Anime not found' },
                { status: 404 }
            );
        }

        anime.staff = [...(anime.staff || []), character];
        await anime.save();

        return NextResponse.json(character, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Failed to add character' },
            { status: 500 }
        );
    }
}

// Optionnel : Ajouter d'autres méthodes si besoin
export async function GET() {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
}
