import UserQuery from '../database/queries/users.js';

async function createNewUser(firstName, lastName, email, password) {
    const user = await UserQuery.getUserByEmail(email);

    if (user) {
        return {
            error: {
                message: 'User already exists',
            },
        };
    }

    const userId = await UserQuery.addUser({
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
