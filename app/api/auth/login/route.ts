import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  try {
    // Connecter à la base de données
    await connectDB();

    const { email, password } = await req.json();

    // Trouver l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return new Response("Invalid credentials", { status: 400 });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid credentials", { status: 400 });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!, // Assure-toi que cette clé est bien définie dans le fichier .env
      { expiresIn: "1h" }
    );

    // Définir le token dans un cookie sécurisé
    const headers = new Headers();
    headers.append("Set-Cookie", `token=${token}; Path=/; Max-Age=3600; SameSite=Strict;`);

    return new Response("Logged in successfully", { status: 200, headers });

  } catch (error) {
    console.error("Error logging in:", error);
    return new Response("Error logging in", { status: 500 });
  }
};
