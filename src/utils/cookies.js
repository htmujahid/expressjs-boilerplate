export function getCookie(req, cookieName) {
    const cookies = req.headers.cookie;
    if (!cookies) return null;
    const cookieArray = cookies.split(';');
    const cookieObject = {};

    cookieArray.forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookieObject[key.trim()] = value;
    });

    return cookieObject[cookieName];
}

export function getCookies(req) {
    const cookies = req.headers.cookie;
    if (!cookies) return null;
    const cookieArray = cookies.split(';');
    const cookieObject = {};

    cookieArray.forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookieObject[key.trim()] = value;
    });

    return cookieObject;
}

export function setCookie(res, cookieName, cookieValue, options = {}) {
    res.cookie(cookieName, cookieValue, options);
}
