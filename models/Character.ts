import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: {
        full: { type: String, required: true },
        native: { type: String },
    },
    image: {
        large: { type: String, required: true },
    },
    description: { type: String },
    age: { type: String },
    gender: { type: String },
    bloodType: { type: String },
    dateOfBirth: {
        year: { type: Number },
        month: { type: Number },
        day: { type: Number },
    },
    media: [
        {
            id: { type: Number },
            title: {
                romaji: { type: String },
                english: { type: String },
            },
            coverImage: { large: { type: String } },
        },
    ],
});

const Character =
    mongoose.models.Character ||
    mongoose.model('Character', characterSchema, 'characters');

export default Character;
