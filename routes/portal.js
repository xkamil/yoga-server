const express = require('express');
const router = express.Router();
const authMid = require('../middleware/authorization');
const portalService = require("../service/portalService");

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

// list
router.get('/', (req, res, next) => {
    portalService.getAll()
        .then(portals => res.json(portals))
        .catch(err => next(err));
});

// get one
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    portalService.get(id)
        .then(portals => res.json(portals))
        .catch(err => next(err));
});

module.exports = router;