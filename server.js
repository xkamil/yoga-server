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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

const port = process.env.PORT || 8080;
const env = process.env.ENV || "DEV";
const configuration = require(`./configuration/${env}.json`);

mongoose.connect(parseDBurl(configuration.database_url), {useNewUrlParser: true});

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

    portalService.addPortal(portalData)
        .then(portal => res.status(201).json(portal))
        .catch(err => next(err));
});

// add section to portal
router.post('/portals/:portal_id/sections/:section_id', (req, res, next) => {
    const portalId = req.params.portal_id;
    const sectionId = req.params.section_id;

    portalService.addSectionToPortal(portalId, sectionId)
        .then(() => res.json(''))
        .catch(next);
});

// remove section from portal
router.delete('/portals/:portal_id/sections/:section_id', (req, res, next) => {
    const portalId = req.params.portal_id;
    const sectionId = req.params.section_id;

    portalService.removeSectionFromPortal(portalId, sectionId)
        .then(() => res.json(''))
        .catch(next);
});

// list of portals
router.get('/portals', (req, res, next) => {
    portalService.getAllPortals()
        .then(portals => res.json(portals))
        .catch(err => next(err));
});

// SECTION ////////////////////////////////////////////////

// add section
router.post('/sections', (req, res, next) => {
    const sectionData = req.body;

    sectionService.addSection(sectionData)
        .then(section => res.status(201).json(section))
        .catch(err => next(err));
});

// list of sections
router.get('/sections', (req, res, next) => {
    sectionService.getAllSections()
        .then(sections => res.json(sections))
        .catch(err => next(err));
});

// add content item to section
router.post('/sections/:section_id/content_items/:content_item_id', (req, res, next) => {
    const contentItemId = req.params.content_item_id;
    const sectionId = req.params.section_id;

    sectionService.addContentItemToSection(sectionId, contentItemId)
        .then(() => res.json(''))
        .catch(next);
});

// remove content item from section
router.delete('/sections/:section_id/content_items/:content_item_id', (req, res, next) => {
    const contentItemId = req.params.content_item_id;
    const sectionId = req.params.section_id;

    sectionService.removeContentItemFromSection(sectionId, contentItemId)
        .then(() => res.json(''))
        .catch(next);
});

// CONTENT ITEM /////////////////////////////////////////////

// add content item
router.post('/content_items', (req, res, next) => {
    const contentItemData = req.body;

    contentItemService.addContentItem(contentItemData)
        .then(contentItem => res.status(201).json(contentItem))
        .catch(err => next(err));
});

// list of content items
router.get('/content_items', (req, res, next) => {
    contentItemService.getAllContentItems()
        .then(contentItems => res.json(contentItems))
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
    console.log('Server port: ' + port);
    console.log("Environment: " + env);
    console.log(`Database: ${configuration.database_url}`);
});

function parseDBurl(dbUrl) {
    let databaseUrl = dbUrl;

    if (configuration.database_url.indexOf('<dbuser>') !== -1) {
        databaseUrl = databaseUrl.replace('<dbuser>', process.env.DB_USER);
        databaseUrl = databaseUrl.replace('<dbpassword>', process.env.DB_PASSWORD);
    }
    return databaseUrl;
}