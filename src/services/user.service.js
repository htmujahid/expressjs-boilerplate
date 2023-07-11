const httpStatus = require('http-status');
const { User } = require('../database/queries');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    if (await User.getUserByEmail(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (await User.getUserByUsername(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    return User.registerUser(userBody);
};

const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

const getUserById = async (id) => {
    return User.getUser(id);
};

const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.getUserByEmail(updateBody.email)) && user.email !== updateBody.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (
        updateBody.username &&
        (await User.getUserByUsername(updateBody.username)) &&
        user.username !== updateBody.username
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    return User.updateUser(userId, updateBody);
};

const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await User.deleteUser(userId);
    return user._id;
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
