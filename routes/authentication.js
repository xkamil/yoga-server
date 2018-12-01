const express = require('express');
const router = express.Router();
const auth = require('../libs/auth');
const conf = require('../configuration/configuration');
const authMid = require('../middleware/authorization');

// login
router.post('/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    if (user === conf.credentials.username && password === conf.credentials.password) {
        res.json(auth.createJWToken());
    } else {
        res.status(401).json('Authentication failed');
    }
});

// validate token
router.get('/validate_token', authMid, (req, res) => {
    res.send('');
});

module.exports = router;