export function getAuthToken(req) {
    return req.headers.authorization.split(' ')[1];
}
