const logger = require('../libs/logger');

function loggingMid(req, res, next) {
    const resJson = res.json;
    const resSend = res.send;

    logger.info(`Handling ${req.method} ${req.path}`);

    res.json = function (data) {
        logger.info(`Responding with HTTP ${res.statusCode}`);
        resJson.call(this, data);
    };

    res.send = function (data) {
        logger.info(`Responding with HTTP ${res.statusCode}`);
        resSend.call(this, data);
    };

    next();
}

module.exports = loggingMid;