import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    main_picture: {
        medium: { type: String },
        large: { type: String },
    },
    start_date: { type: Date },
    alternative_titles: {
        synonyms: { type: [String] },
        en: { type: String },
        ja: { type: String },
    },
    synopsis: { type: String },
    mean: { type: Number },
    rank: { type: Number },
    popularity: { type: Number },
    num_list_users: { type: Number },
    num_scoring_users: { type: Number },
    nsfw: { type: String, enum: ['white', 'gray', 'black'] },
    created_at: { type: Date },
    updated_at: { type: Date },
    media_type: { type: String },
    status: { type: String },
    num_volumes: { type: Number },
    num_chapters: { type: Number },
    ranking: {
        rank: { type: Number },
    },
    authors: { type: String },
    genres: { type: [String] },
    end_date: { type: Date },
});

const Manga =
    mongoose.models.Manga ||
    mongoose.model('Manga', mangaSchema, 'mangaCollection');

export default Manga;
