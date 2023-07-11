require('dotenv').config();

const addEnvToRequest = () => (req, res, next) => {
    req.env = {
        NODE_ENV: process.env.NODE_ENV,
    };
    next();
}

module.exports = {
    addEnvToRequest,
};