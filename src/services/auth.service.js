const httpStatus = require('http-status');
const tokenService = require('./token.service');
const { User, Token } = require('../database/queries');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const bcrypt = require('bcryptjs');

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await User.getUserByEmailWithPassword(email);
    if (!user || !(await isPasswordMatch(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Credentials');
    }
    return {
        ...user,
        password: undefined,
        createdAt: undefined,
        modifiedAt: undefined,
    }
};

const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.getToken(refreshToken, tokenTypes.REFRESH, false);
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await Token.deleteToken(refreshTokenDoc.userId, tokenTypes.REFRESH);
};

const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await User.getUser(refreshTokenDoc.userId);
        if (!user) {
            throw new Error();
        }
        await Token.deleteToken(user._id, tokenTypes.REFRESH);
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        const user = await User.getUser(resetPasswordTokenDoc.userId);
        if (!user) {
            throw new Error();
        }
        await User.updatePassword(user._id, newPassword);
        await Token.deleteToken(user._id, tokenTypes.RESET_PASSWORD);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await User.getUser(verifyEmailTokenDoc.userId);
        if (!user) {
            throw new Error();
        }
        await Token.deleteToken(user._id, tokenTypes.VERIFY_EMAIL);
        await User.verifyUserEmail(user._id);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
};

const isPasswordMatch = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
};
