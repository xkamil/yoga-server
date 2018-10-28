const express = require('express');
const router = express.Router();
const ENV = require('../utils').getEnvVariables();
const auth = require('../libs/auth');

// login
router.post('/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    if (user === ENV.KARMA_USER && password === ENV.KARMA_PASSWORD) {
        const token = auth.createJWToken();

        res.json(token);
    } else {
        res.status(401).json('Authentication failed');
    }
});


module.exports = router;