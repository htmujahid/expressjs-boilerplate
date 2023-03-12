import process from '../config/dotenv.js';
import { setCookie } from '../utils/cookies.js';
import userService from '../services/user.service.js';
import authService from '../services/auth.service.js';

async function userLogin(req, res, next) {
    const { email, password } = req.body;

    const { token, id, error } = await authService.loginWithEmailAndPassword(email, password);

    if (error) {
        return res.status(400).json({
            error,
        });
    }

    setCookie(res, 'auth-session-token', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return res.status(200).json({
        id,
    });
}

async function userRegister(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    const { id, error } = await userService.createNewUser(firstName, lastName, email, password);

    if (error) {
        return res.status(400).json({
            error,
        });
    }

    return res.status(200).json({
        id,
    });
}

export default { userLogin, userRegister };
