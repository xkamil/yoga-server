const express = require('express');
const router = express.Router();
const logger = require('../libs/logger');
const sendEmail = require('../service/emailService');

router.post('/email', (req, res, next) => {
    const from = req.body.from;
    const message = req.body.message;

    logger.debug("Sending email: \n", req.body);

    sendEmail(from, message)
        .then(response => res.json(response))
        .catch(err => next(err));
});

module.exports = router;