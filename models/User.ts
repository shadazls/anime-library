import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' }, // URL de l'avatar
    bannerImage: { type: String, default: '' }, // URL de la bannière

    // Listes d'animés avec références
    to_watch: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', default: [] },
    ],
    watching: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', default: [] },
    ],
    watched: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', default: [] },
    ],
    rewatching: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', default: [] },
    ],
    abandoned: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', default: [] },
    ],
});

const User =
    mongoose.models.User || mongoose.model('User', userSchema, 'users');

export default User;
