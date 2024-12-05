import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: {
        full: { type: String, required: true },
        native: { type: String, default: '' }, // Ajout d'une valeur par défaut
    },
    image: {
        large: { type: String, required: true },
        medium: { type: String, default: '' }, // Ajout d'une valeur par défaut
    },
    role: { type: String, required: true },
});

const staffSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: {
        full: { type: String, required: true },
        native: { type: String, default: '' },
    },
    image: {
        large: { type: String, required: true },
        medium: { type: String, default: '' },
    },
});

const animeSchema = new mongoose.Schema({
    anime_id: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    english_name: { type: String },
    other_name: { type: String },
    Score: { type: Number },
    Genres: { type: [String] },
    Synopsis: { type: String },
    Type: { type: String },
    Episodes: { type: Number },
    Aired: { type: String },
    Premiered: { type: String },
    Status: { type: String },
    Producers: { type: [String] },
    Licensors: { type: [String] },
    Studios: { type: [String] },
    Source: { type: String },
    Duration: { type: String },
    Rating: { type: String },
    Rank: { type: Number },
    Popularity: { type: Number },
    Favorites: { type: Number },
    scored_by: { type: Number },
    Members: { type: Number },
    image_url: { type: String },
    trailer_url: { type: String },
    characters: { type: [characterSchema], default: [] },
    staff: { type: [staffSchema], default: [] },
});

const Anime =
    mongoose.models.Anime ||
    mongoose.model('Anime', animeSchema, 'animeCollection');

export default Anime;
