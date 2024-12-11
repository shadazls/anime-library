import { Schema, model, models } from 'mongoose';

const StaffSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: {
        full: { type: String, required: true },
        native: { type: String },
    },
    image: {
        large: { type: String, required: true },
    },
    description: { type: String },
    age: { type: Number },
    bloodType: { type: String },
    dateOfBirth: {
        year: { type: Number },
        month: { type: Number },
        day: { type: Number },
    },
    dateOfDeath: {
        year: { type: Number },
        month: { type: Number },
        day: { type: Number },
    },
    gender: { type: String },
    homeTown: { type: String },
    languageV2: { type: String },
    primaryOccupations: [{ type: String }],
    staffMedia: [
        {
            id: { type: Number, required: true },
            title: {
                romaji: { type: String, required: true },
                english: { type: String },
            },
            coverImage: {
                large: { type: String, required: true },
            },
        },
    ],
});

const Staff = models.Staff || model('Staff', StaffSchema);

export default Staff;
