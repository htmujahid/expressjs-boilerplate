import { verify } from "jsonwebtoken";

export async function tokenChecker(req, res, next) {
    const token = await verify(req);
    if (!token) return res.status(401).end();
    const { email, role, sub: _id, name } = token;
    req.user = {
        _id,
        email,
        role,
        name,
    };
    return await next();
}

export function roleAuthorization(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(403).end();
        return next();
    };
}
