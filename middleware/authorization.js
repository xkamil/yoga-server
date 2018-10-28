const auth = require('../libs/auth');

function authMid(req, res, next) {
    const token = req.get('token') || '';

    auth.verifyJWTToken(token)
        .then(() => next())
        .catch(() => {
            res.status(401).json('Invalid token provided!');
        });
}

module.exports = authMid;