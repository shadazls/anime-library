import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error(
                'JWT_SECRET is not defined in the environment variables'
            );
        }

        // Vérification du token
        const decoded = jwt.verify(token, jwtSecret); // Typage strict ici

        // Si le token est valide, continuer vers la route protégée
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
};

export const config = {
    matcher: ['/protected/:path*'], // Appliquer ce middleware aux routes protégées
};
