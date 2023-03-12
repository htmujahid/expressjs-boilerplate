import process from '../config/dotenv.js';
import jwt from 'jsonwebtoken';

function signToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        },
    );
}

export default { signToken };
