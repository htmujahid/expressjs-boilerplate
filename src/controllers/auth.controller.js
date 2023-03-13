import process from '../config/dotenv.js';
import { setCookie, getCookie } from '../utils/cookies.js';
import userService from '../services/user.service.js';
import authService from '../services/auth.service.js';

async function userLogin(req, res, next) {
    const { email, password } = req.body;

    const { token, user, error } = await authService.loginWithEmailAndPassword(email, password);

    if (error) {
        return res.status(400).json({
            error,
        });
    }

    setCookie(res, 'auth-session-token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
        secure: false,
        sameSite: 'none',
    });

    return res.status(200).json({
        user,
        token,
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
