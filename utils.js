const fs = require('fs');
const path = require('path');
const logger = require('./libs/logger');
const KEY_PATH = path.join(__dirname, '/certs/cert.key');
const CERT_PATH = path.join(__dirname, '/certs/cert.crt');

function getHttpsCredentials() {
    if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
        return {
            key: fs.readFileSync(KEY_PATH),
            cert: fs.readFileSync(CERT_PATH)
        }
    } else {
        logger.info(`${KEY_PATH} or ${CERT_PATH} does not exists.`);
        return null;
    }
}

function getUniqueElements(arr) {
    const uniqueElements = [];

    arr.forEach(e => {
        if (uniqueElements.indexOf(e) === -1) {
            uniqueElements.push(e);
        }
    });

    return uniqueElements;
}

function getTime() {
    return Math.floor(new Date().getTime() / 1000);
}

module.exports = {
    getHttpsCredentials,
    getUniqueElements,
    getTime
};