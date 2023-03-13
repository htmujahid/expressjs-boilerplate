import { verify } from 'jsonwebtoken';
import process from '../config/dotenv.js';
import { getAuthToken } from '../utils/token.js';

async function tokenChecker(req, res, next) {
    const token_cookie = getAuthToken(req);
    if (!token_cookie) {
        return res.status(401).json({
            message: 'You are not authenticated to access this resource',
        });
    }
    try {
        const token = await verify(token_cookie, process.env.JWT_SECRET);
        if (!token)
            return res.status(401).json({
                message: 'You are not authenticated to access this resources',
            });

        const { _id, email, role, firstName, lastName } = token;
        req.user = {
            _id,
            firstName,
            lastName,
            email,
            role,
        };
    } catch (err) {
        return res.status(401).json({
            message: 'You are not authenticated to access this resource',
        });
    }
    return await next();
}

function roleAuthorization(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return res.status(403).json({
                message: 'You are not authorized to access this resource',
            });
        return next();
    };
}

export default {
    tokenChecker,
    roleAuthorization,
};
