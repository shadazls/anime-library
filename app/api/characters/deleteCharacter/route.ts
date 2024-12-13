import connectDB from '@/lib/db';
import Character from '@/models/Character';
import { NextResponse } from 'next/server';

export const DELETE = async (req: Request) => {
    await connectDB();

    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { error: 'Character ID is required' },
                { status: 400 }
            );
        }

        const deletedCharacter = await Character.findOneAndDelete({ id });
        if (!deletedCharacter) {
            return NextResponse.json(
                { error: 'Character not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Character deleted successfully' });
    } catch (error) {
        console.error('Error deleting character:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
