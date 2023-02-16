import { verify } from "jsonwebtoken";
import process from "../../config/dotenv.js";
import { getCookie } from "../../utils/cookies.js";

export async function tokenChecker(req, res, next) {
    const token_cookie = getCookie(req, "token");
    if (!token_cookie) {
        return res.status(401).json({
            message: "You are not authenticated to access this resource",
        });
    }
    const token = await verify(token_cookie, process.env.JWT_SECRET);
    console.log(token);
    if (!token)
        return res.status(401).json({
            message: "You are not authenticated to access this resource",
        });
    const { _id, email, role } = token;
    req.user = {
        _id,
        email,
        role,
    };
    return await next();
}

export function roleAuthorization(roles) {
    return (req, res, next) => {
        console.log(req.user.role);
        if (!roles.includes(req.user.role))
            return res.status(403).json({
                message: "You are not authorized to access this resource",
            });
        return next();
    };
}
