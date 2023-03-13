export const loginForm = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            errorMessage: {
                format: 'Email format is incorrect',
            },
        },
        password: {
            type: 'string',
            format: 'password',
            errorMessage: {
                format: 'Password cannot be empty',
            },
        },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};

export const registerForm = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            minLength: 1,
            errorMessage: {
                minLength: 'First name cannot be empty',
            },
        },
        lastName: {
            type: 'string',
        },
        email: {
            type: 'string',
            format: 'email',
            errorMessage: {
                format: 'Email format is incorrect',
            },
        },
        password: {
            type: 'string',
            minLength: 8,
            errorMessage: {
                minLength: 'Password must be at least 8 characters long',
            },
        },
    },
    required: ['firstName', 'email', 'password'],
    additionalProperties: false,
};
