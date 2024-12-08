import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' }, // URL de l'avatar
    bannerImage: { type: String, default: '' }, // URL de la bannière
    description: { type: String, default: '' }, // Description de l'utilisateur
    birthdate: { type: Date },
    preferences: {
        titleLanguage: { type: String },
        staffCharacterLanguage: { type: String },
    },

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
