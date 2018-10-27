const Utils = require('../utils');
const logger = Utils.getLogger();
const basicAuth = require('express-basic-auth');

const USERNAME = process.env.KARMA_USER;
const PASSWORD = process.env.KARMA_PASSWORD;

function authMid() {
    const users = {};
    users[USERNAME] = PASSWORD;

    return basicAuth({users});
}

module.exports = authMid;