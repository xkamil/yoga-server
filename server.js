const portalService = require("./service/portalService");
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

// ROUTES =============================================================================
const router = express.Router();

router.get('/health', function (req, res) {
    res.json({
        api: "UP",
        database: mongoose.connection.readyState === 1 ? "UP" : "DOWN"
    });
});

//mlabkarma321 user1
// add portal
router.post('/portals', (req, res, next) => {
    let portalData = req.body;

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

// section
const Section = require('./model/section');

router.post('/sections', (req, res, next) => {
    let sectionData = req.body;

    const newSection = new Section(sectionData);
    const validationErrors = newSection.validateSync();

    if (validationErrors) {
        res.status(400).json(validationErrors.errors);
    } else {
        new Section(sectionData).save()
            .then(section => res.status(201).json(section))
            .catch(err => next(err));
    }
});

router.get('/sections', (req, res, next) => {
    Section.find()
        .populate('portals')
        .then(sections => res.json(sections))
        .catch(err => next(err))
});


// error handler

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