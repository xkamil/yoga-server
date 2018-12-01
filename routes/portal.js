const express = require('express');
const router = express.Router();
const authMid = require('../middleware/authorization');
const portalService = require("../service/portalService");
const logger = require('../libs/logger');
const {getTime} = require('../utils');
const conf = require('../configuration/configuration');

const cache = {
    cached_at: 0,
    data: null
};

// reset cache
router.get('/reset_cache', authMid, (req, res) => {
    cache.cached_at = 0;
    cache.data = null;
    res.send('');
});

// list
router.get('/', (req, res, next) => {
    if (!cache.data || cache.cached_at + conf.portal_cache_timeout <= getTime()) {
        portalService.getAll()
            .then(portals => {
                cache.data = portals;
                cache.cached_at = getTime();
                res.json(portals)
            })
            .catch(err => next(err));
    } else {
        logger.debug('Returning cached portals');
        res.json(cache.data);
    }
});

// get one
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    portalService.get(id)
        .then(portals => res.json(portals))
        .catch(err => next(err));
});

// add
router.post('/', authMid, (req, res, next) => {
    const portalData = req.body;

    portalService.add(portalData)
        .then(portal => res.status(201).json(portal))
        .catch(err => next(err));
});

// delete
router.delete('/:id', authMid, (req, res, next) => {
    const id = req.params.id;

    portalService.remove(id)
        .then(portal => res.json('Portal deleted'))
        .catch(err => next(err));
});

// update
router.post('/:id', authMid, (req, res, next) => {
    const id = req.params.id;
    const portalData = req.body;

    portalService.update(id, portalData)
        .then(portal => res.json('Portal updated'))
        .catch(err => next(err));
});

module.exports = router;