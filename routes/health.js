const express = require('express');
const router = express.Router();
const fs = require('fs');
const authMid = require('../middleware/authorization');
const mongoose = require('mongoose');


router.get('/health', authMid, function (req, res) {
    res.json({
        api: "UP",
        database: mongoose.connection.readyState === 1 ? "UP" : "DOWN"
    });
});

router.get('/logs', authMid, (req, res, next) => {
    fs.readFile('./logs.log', (err, data) => {
        err ? next(err) : res.send(data);
    });
});

module.exports = router;