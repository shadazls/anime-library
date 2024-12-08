import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();

        // Récupérer tous les utilisateurs
        const users = await User.find().select('-password'); // Exclut le mot de passe pour des raisons de sécurité
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch users' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
