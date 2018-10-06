const portalService = require("./service/portalService");
const sectionService = require("./service/sectionService");
const contentItemService = require("./service/contentItemService");
const ApiError = require('./error').ApiError;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const Utils = require('./utils');
const logger = Utils.getLogger();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

const port = process.env.PORT || 8080;
const configuration = Utils.getConfiguration();

Utils.getLogger().info(Utils.getParsedDbUrl())

mongoose.connect(Utils.getParsedDbUrl(), {useNewUrlParser: true});

// ROUTES
const router = express.Router();

router.get('/health', function (req, res) {
    res.json({
        api: "UP",
        database: mongoose.connection.readyState === 1 ? "UP" : "DOWN"
    });
});


// PORTAL ////////////////////////////////////////////////

// add portal
router.post('/portals', (req, res, next) => {
    const portalData = req.body;

    portalService.add(portalData)
        .then(portal => res.status(201).json(portal))
        .catch(err => next(err));
});

// delete portal
router.delete('/portals/:id', (req, res, next) => {
    const portalId = req.params.id;

    portalService.remove(portalId)
        .then(portal => res.status(200).json('Portal deleted'))
        .catch(err => next(err));
});

// add section to portal
router.post('/portals/:portal_id/sections/:section_id', (req, res, next) => {
    const portalId = req.params.portal_id;
    const sectionId = req.params.section_id;

    portalService.add(portalId, sectionId)
        .then(() => res.json(''))
        .catch(next);
});

// update portal
router.post('/portals/:id', (req, res, next) => {
    const id = req.params.id;
    const portalData = req.body;

    portalService.update(id, portalData)
        .then(portal => res.status(200).json('Portal updated'))
        .catch(err => next(err));
});

// remove section from portal
router.delete('/portals/:portal_id/sections/:section_id', (req, res, next) => {
    const portalId = req.params.portal_id;
    const sectionId = req.params.section_id;

    portalService.removeSection(portalId, sectionId)
        .then(() => res.json(''))
        .catch(next);
});

// list of portals
router.get('/portals', (req, res, next) => {
    portalService.getAll()
        .then(portals => res.json(portals))
        .catch(err => next(err));
});

// SECTION ////////////////////////////////////////////////

// add section
router.post('/sections', (req, res, next) => {
    const sectionData = req.body;

    sectionService.add(sectionData)
        .then(section => res.status(201).json(section))
        .catch(err => next(err));
});

// list of sections
router.get('/sections', (req, res, next) => {
    sectionService.getAll()
        .then(sections => res.json(sections))
        .catch(err => next(err));
});

// delete section
router.delete('/sections/:id', (req, res, next) => {
    const sectionId = req.params.id;

    sectionService.remove(sectionId)
        .then(portal => res.status(200).json('Section deleted'))
        .catch(err => next(err));
});

// update section
router.post('/sections/:id', (req, res, next) => {
    const id = req.params.id;
    const sectionData = req.body;

    sectionService.update(id, sectionData)
        .then(portal => res.status(200).json('Section updated'))
        .catch(err => next(err));
});

// add content item to section
router.post('/sections/:section_id/content_items/:content_item_id', (req, res, next) => {
    const contentItemId = req.params.content_item_id;
    const sectionId = req.params.section_id;

    sectionService.addContentItem(sectionId, contentItemId)
        .then(() => res.json(''))
        .catch(next);
});

// remove content item from section
router.delete('/sections/:section_id/content_items/:content_item_id', (req, res, next) => {
    const contentItemId = req.params.content_item_id;
    const sectionId = req.params.section_id;

    sectionService.removeContentItem(sectionId, contentItemId)
        .then(() => res.json(''))
        .catch(next);
});

// CONTENT ITEM /////////////////////////////////////////////

// add content item
router.post('/content_items', (req, res, next) => {
    const contentItemData = req.body;

    contentItemService.add(contentItemData)
        .then(contentItem => res.status(201).json(contentItem))
        .catch(err => next(err));
});

// list of content items
router.get('/content_items', (req, res, next) => {
    contentItemService.getAll()
        .then(contentItems => res.json(contentItems))
        .catch(err => next(err));
});

// delete content item
router.delete('/content_items/:id', (req, res, next) => {
    const contentItemId = req.params.id;

    contentItemService.remove(contentItemId)
        .then(portal => res.status(200).json('Content item deleted'))
        .catch(err => next(err));
});

// update content item
router.post('/content_items/:id', (req, res, next) => {
    const id = req.params.id;
    const contentItemData = req.body;

    contentItemService.update(id, contentItemData)
        .then(portal => res.status(200).json('Content item updated'))
        .catch(err => next(err));
});


// ERROR HANDLER //////////////////////////////////////////

router.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.type.http_status).json(err);
    } else {
        res.status(500).json(err);
    }
});

app.use('/api', router);

app.listen(port, () => {
    logger.info('Server port: ' + port);
    logger.info("Environment: " + Utils.getEnv());
    logger.info(`Database: ${configuration.database_url}`);
});