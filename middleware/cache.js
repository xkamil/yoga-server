const Utils = require('../utils');
const logger = Utils.getLogger();

function cacheMid(req, res, next) {
    if (!this.cache) {
        this.cache = {};
    }

    const cache = this.cache;
    const resJson = res.json;

    res.json = function (body) {
        if (req.method === 'GET' && !cache[req.path]) {
            logger.debug('Storing response in cache');
            cache[req.path] = body;
        }
        resJson.call(this, body);
    };

    logger.debug(`${req.method} ${req.path}`);

    if (req.method !== 'GET') {
        cache[req.path] = null;
        logger.debug(`Clearing cache for ${req.path}`);
        next();
    } else if (cache[req.path]) {
        logger.debug(`Sending response from cache`);
        res.json(cache[req.path])
    } else {
        next();
    }
}

module.exports = cacheMid;