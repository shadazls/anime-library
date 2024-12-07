const aggregateUserAnimeLists = async (userId) => {
    const user = await User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'animeCollection', // Nom de la collection d'animés
                localField: 'to_watch',
                foreignField: '_id',
                as: 'to_watch_animes',
            },
        },
        {
            $lookup: {
                from: 'animeCollection',
                localField: 'watching',
                foreignField: '_id',
                as: 'watching_animes',
            },
        },
        {
            $lookup: {
                from: 'animeCollection',
                localField: 'watched',
                foreignField: '_id',
                as: 'watched_animes',
            },
        },
        {
            $lookup: {
                from: 'animeCollection',
                localField: 'rewatching',
                foreignField: '_id',
                as: 'rewatching_animes',
            },
        },
        {
            $lookup: {
                from: 'animeCollection',
                localField: 'abandoned',
                foreignField: '_id',
                as: 'abandoned_animes',
            },
        },
    ]);

    console.log(user[0]); // Contient les données de l'utilisateur avec ses listes
};
