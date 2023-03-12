import { addUser, getUserByEmail } from '../database/queries/users.js';

async function createNewUser(firstName, lastName, email, password) {
    const user = await getUserByEmail(email);

    if (user) {
        return {
            error: {
                message: 'User already exists',
            },
        };
    }

    const userId = await addUser({
        firstName,
        lastName,
        email,
        password,
    });

    return {
        id: userId,
    };
}

export default { createNewUser };
