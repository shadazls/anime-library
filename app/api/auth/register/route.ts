import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';

export const POST = async (req: Request) => {
    try {
        // Connecter à la base de données
        await connectDB();

        const { email, password, name } = await req.json();

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return new Response('User already exists', { status: 400 });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Création de l'utilisateur
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();
        return new Response('User created successfully', { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return new Response('Error registering user', { status: 500 });
    }
};
