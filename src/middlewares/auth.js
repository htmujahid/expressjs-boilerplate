const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]));
    }

    req.user = user;

    if (roles.length && !roles.includes(user.role) && req.params.userId != user._id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }

    resolve();
};

const auth =
    (...roles) =>
    async (req, res, next) => {
        // eslint-disable-next-line no-undef
        return new Promise((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(
                req,
                res,
                next,
            );
        })
            .then(() => next())
            .catch((err) => next(err));
    };

module.exports = auth;
 