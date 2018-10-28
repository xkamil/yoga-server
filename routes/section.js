const express = require('express');
const router = express.Router();
const authMid = require('../middleware/authorization');
const sectionService = require("../service/sectionService");

// add
router.post('/', authMid, (req, res, next) => {
    const sectionData = req.body;

    sectionService.add(sectionData)
        .then(section => res.status(201).json(section))
        .catch(err => next(err));
});

// list
router.get('/', (req, res, next) => {
    sectionService.getAll()
        .then(sections => res.json(sections))
        .catch(err => next(err));
});

// get one
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    sectionService.get(id)
        .then(sections => res.json(sections))
        .catch(err => next(err));
});

// delete
router.delete('/:id', authMid, (req, res, next) => {
    const sectionId = req.params.id;

    sectionService.remove(sectionId)
        .then(() => res.json('Section deleted'))
        .catch(err => next(err));
});

// update
router.post('/:id', authMid, (req, res, next) => {
    const id = req.params.id;
    const sectionData = req.body;

    sectionService.update(id, sectionData)
        .then(() => res.json('Section updated'))
        .catch(err => next(err));
});

module.exports = router;