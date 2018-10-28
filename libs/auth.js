const jwt = require('jsonwebtoken');
const Utils = require('../utils');
const ENV = Utils.getEnvVariables();
const configuration = Utils.getConfiguration();

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, ENV.JWT_SECRET, (err, decodedToken) => {
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
    }, ENV.JWT_SECRET, {
        expiresIn: configuration.authentication_timeout,
        algorithm: 'HS256'
    });
}

module.exports = {
    verifyJWTToken,
    createJWToken
};