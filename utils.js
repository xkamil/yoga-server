const fs = require('fs');
const path = require('path');
const conf = require('./configuration/configuration');

function getHttpsCredentials() {
    return new Promise((resolve, reject) => {
        try {
            const credentials = {
                    key: fs.readFileSync(path.join(__dirname, '/certs/cert.key')),
                    cert: fs.readFileSync(path.join(__dirname, '/certs/cert.crt'))
                };
            resolve(credentials);
        } catch (e) {
            reject(e);
        }
    });
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

module.exports = {
    getHttpsCredentials,
    getUniqueElements
};