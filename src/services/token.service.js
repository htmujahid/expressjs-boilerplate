const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const { Token, User } = require('../database/queries');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
require('dotenv').config();

const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.createToken(token, userId, type, blacklisted, expires.toDate());
    return tokenDoc;
};

const verifyToken = async (token, type) => {
    jwt.verify(token, process.env.JWT_SECRET);
    const tokenDoc = await Token.getToken(token, type, false);
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user._id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

const generateResetPasswordToken = async (email) => {
    const user = await User.getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'minutes');
    const verifyEmailToken = generateToken(user._id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user._id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
