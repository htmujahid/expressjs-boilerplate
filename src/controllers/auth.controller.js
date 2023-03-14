import UserService from '../services/user.service.js';
import AuthService from '../services/auth.service.js';
import { setCookie } from '../utils/cookies.js';

async function userLogin(req, res) {
    const { email, password } = req.body;

    const { token, user, error } = await AuthService.loginWithEmailAndPassword(email, password);

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

async function userRegister(req, res) {
    const { firstName, lastName, email, password } = req.body;

    const { id, error } = await UserService.createNewUser(firstName, lastName, email, password);

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
