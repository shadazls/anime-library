import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
    anime_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    english_name: { type: String },
    other_name: { type: String },
    score: { type: Number },
    genres: { type: [String] },
    synopsis: { type: String },
    type: { type: String },
    episodes: { type: Number },
    aired: { type: String },
    premiered: { type: String },
    status: { type: String },
    producers: { type: [String] },
    licensors: { type: [String] },
    studios: { type: [String] },
    source: { type: String },
    duration: { type: String },
    rating: { type: String },
    rank: { type: Number },
    popularity: { type: Number },
    favorites: { type: Number },
    scored_by: { type: Number },
    members: { type: Number },
    image_url: { type: String },
});

const Anime = mongoose.models.Anime || mongoose.model('Anime', animeSchema, 'animeCollection');

export default Anime;
