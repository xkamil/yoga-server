const express = require('express');
const router = express.Router();
const auth = require('../libs/auth');
const conf = require('../configuration/configuration');

// login
router.post('/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    if (user === conf.credentials.username && password === conf.credentials.password) {
        const token = auth.createJWToken();

        res.json(token);
    } else {
        res.status(401).json('Authentication failed');
    }
});


module.exports = router;