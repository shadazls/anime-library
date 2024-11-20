import mongoose from 'mongoose';

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
});

const Anime = mongoose.models.Anime || mongoose.model('Anime', animeSchema, 'animeCollection');

export default Anime;
