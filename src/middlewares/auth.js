const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User, Role } = require('../database/queries');

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]));
    }

    req.user = user;

    if (roles.length && user.role && !roles.includes(user.role) && req.params.userId != user._id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }

    resolve();
};

const auth =
    (...roles) =>
    async (req, res, next) => {
        // eslint-disable-next-line no-undef
        return new Promise((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(req, res, next);
        })
            .then(() => next())
            .catch((err) => next(err));
    };

const roleAuthorization =
    (...roles) =>
    async (req, res, next) => {
        const userRoles = await User.getUserRoles(req.user._id);

        if (roles.length && !userRoles.some((role) => roles.includes(role)) && req.params.userId != req.user._id) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }

        next();
    };

const permissionAuthorization =
    (...permissions) =>
    async (req, res, next) => {
        const userRoles = await User.getUserRoles(req.user._id);
        let rolePermissions = [];

        // eslint-disable-next-line no-undef
        await Promise.all(
            userRoles.map(async (role) => {
                rolePermissions = rolePermissions.concat(await Role.getRolePermissions(role));
            })
        );

        if (
            permissions.length &&
            !rolePermissions.some((permission) => permissions.includes(permission)) &&
            req.params.userId != req.user._id
        ) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }

        next();
    };

module.exports = {
    auth,
    roleAuthorization,
    permissionAuthorization,
};
