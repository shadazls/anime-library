import connectDB from '@/lib/db';
import User from '@/models/User';

export const PUT = async (req) => {
    try {
        await connectDB();

        // Récupérer l'ID et les données à mettre à jour depuis la requête
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // Récupérer l'ID passé comme paramètre

        if (!id) {
            return new Response('User ID is required', { status: 400 });
        }

        const body = await req.json(); // Récupérer les données envoyées avec la requête

        if (!body || Object.keys(body).length === 0) {
            return new Response('No data provided for update', { status: 400 });
        }

        // Mettre à jour l'utilisateur avec les nouvelles données
        const updatedUser = await User.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (!updatedUser) {
            return new Response('User not found', { status: 404 });
        }

        // Structurer le retour pour inclure seulement les champs nécessaires
        const responseUser = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            description: updatedUser.description,
            avatar: updatedUser.avatar,
            birthdate: updatedUser.birthdate,
            preferences: updatedUser.preferences,
        };

        return new Response(JSON.stringify({ user: responseUser }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to update user', {
            status: 500,
        });
    }
};
