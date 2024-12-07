const getUserWithAnimeLists = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('to_watch')
            .populate('watching')
            .populate('watched')
            .populate('rewatching')
            .populate('abandoned');

        console.log(user);
        return user;
    } catch (error) {
        console.error('Error fetching user with anime lists:', error.message);
    }
};
