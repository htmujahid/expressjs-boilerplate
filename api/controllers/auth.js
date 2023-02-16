import {
    addUser,
    getUserByEmail,
    getUserPassword,
} from "../../database/queries/users.js";
import { comparePassword } from "../../utils/compare.js";
import process from "../../config/dotenv.js";
import Jwt from "jsonwebtoken";

export async function userLogin(req, res, next) {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(400).json({
            error: {
                message: "No user found with this email",
            },
        });
    }

    const userPassword = await getUserPassword(user._id);
    const passwordMatch = await comparePassword(password, userPassword);
    if (!passwordMatch) {
        return res.status(400).json({
            error: {
                message: "Invalid password",
            },
        });
    }

    const token = Jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({
        id: user._id,
    });
}

export async function userRegister(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    const user = await getUserByEmail(email);

    if (user) {
        return res.status(400).json({
            error: {
                message: "User already exists",
            },
        });
    }

    const userId = await addUser({
        firstName,
        lastName,
        email,
        password,
    });

    return res.status(200).json({
        id: userId,
    });
}
