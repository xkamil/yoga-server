const getUniqueElements = require('../utils').getUniqueElements;
const express = require('express');
const router = express.Router();
const authMid = require('../middleware/authorization');
const contentItemService = require("../service/contentItemService");

// add
router.post('/', authMid, (req, res, next) => {
    const contentItemData = req.body;

    contentItemData.tags = contentItemData.tags ? getUniqueElements(contentItemData.tags) : [];

    contentItemService.add(contentItemData)
        .then(contentItem => res.status(201).json(contentItem))
        .catch(err => next(err));
});

// list
router.get('/', (req, res, next) => {
    contentItemService.getAll()
        .then(contentItems => res.json(contentItems))
        .catch(err => next(err));
});

// get tags
router.get('/tags', (req, res, next) => {
    contentItemService.getAllTags()
        .then(tags => res.json(tags))
        .catch(err => next(err));
});

// get one
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    contentItemService.get(id)
        .then(contentItem => res.json(contentItem))
        .catch(err => next(err));
});

// delete
router.delete('/:id', authMid, (req, res, next) => {
    const id = req.params.id;

    contentItemService.remove(id)
        .then(portal => res.json('Content item deleted'))
        .catch(err => next(err));
});

// update
router.post('/:id', authMid, (req, res, next) => {
    const id = req.params.id;
    const contentItemData = req.body;
    contentItemData.tags = contentItemData.tags ? getUniqueElements(contentItemData.tags) : [];

    contentItemService.update(id, contentItemData)
        .then(portal => res.json('Content item updated'))
        .catch(err => next(err));
});

module.exports = router;