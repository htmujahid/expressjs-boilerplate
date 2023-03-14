import { comparePassword } from '../utils/compare.js';
import UserQuery from '../database/queries/users.js';
import TokenService from './token.service.js';

async function loginWithEmailAndPassword(email, password) {
    const user = await UserQuery.getUserByEmail(email);

    if (!user) {
        return {
            error: {
                message: 'Invalid email',
            },
        };
    }

    const userPassword = await UserQuery.getUserPassword(user._id);
    const passwordMatch = await comparePassword(password, userPassword);

    if (!passwordMatch) {
        return {
            error: {
                message: 'Invalid password',
            },
        };
    }

    const token = TokenService.signToken(user);

    return {
        token,
        user,
    };
}

export default { loginWithEmailAndPassword };
