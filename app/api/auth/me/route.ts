import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    // Récupérer le token dans les cookies (ou dans l'en-tête Authorization)
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Vérifier et décoder le JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Récupérer les informations de l'utilisateur dans la base de données
    const user = await User.findById(decoded.userId);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Retourner les informations utilisateur (limitées)
    return new Response(
      JSON.stringify({ id: user._id, email: user.email, name: user.name }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 401 });
  }
};
