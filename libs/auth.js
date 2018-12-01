const jwt = require('jsonwebtoken');
const conf = require('../configuration/configuration');

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, conf.jwt_secret, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        })
    })
}

function createJWToken() {
    return jwt.sign({
        data: ''
    }, conf.jwt_secret, {
        expiresIn: conf.authentication_timeout,
        algorithm: 'HS256'
    });
}

module.exports = {
    verifyJWTToken,
    createJWToken
};