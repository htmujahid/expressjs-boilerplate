import { comparePassword } from '../utils/compare.js';
import { getUserByEmail, getUserPassword } from '../database/queries/users.js';
import tokenService from './token.service.js';

async function loginWithEmailAndPassword(email, password) {
    const user = await getUserByEmail(email);

    if (!user) {
        return {
            error: {
                message: 'Invalid email',
            },
        };
    }

    const userPassword = await getUserPassword(user._id);
    const passwordMatch = await comparePassword(password, userPassword);

    if (!passwordMatch) {
        return {
            error: {
                message: 'Invalid password',
            },
        };
    }

    const token = tokenService.signToken(user);

    return {
        token,
        user,
    };
}

export default { loginWithEmailAndPassword };
