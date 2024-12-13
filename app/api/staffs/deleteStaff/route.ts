import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { NextResponse } from 'next/server';

export const DELETE = async (req: Request) => {
    await connectDB();

    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { error: 'Staff ID is required' },
                { status: 400 }
            );
        }

        const deletedStaff = await Staff.findOneAndDelete({ id });
        if (!deletedStaff) {
            return NextResponse.json(
                { error: 'Staff not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
