import User from './models/User'; // Chemin vers votre modèle User

const addAnimeToList = async (userId, animeId, listName) => {
    try {
        const validLists = [
            'to_watch',
            'watching',
            'watched',
            'rewatching',
            'abandoned',
        ];
        if (!validLists.includes(listName)) {
            throw new Error('Invalid list name');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user[listName].includes(animeId)) {
            user[listName].push(animeId);
            await user.save();
            console.log(`Anime ${animeId} added to ${listName}`);
        } else {
            console.log('Anime already in list');
        }
    } catch (error) {
        console.error(error.message);
    }
};
