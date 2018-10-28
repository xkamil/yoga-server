const ApiError = require('./error').ApiError;
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const Utils = require('./utils');
const logger = Utils.getLogger();
const EmailService = require('./service/emailService');
const fs = require('fs');
const authMid = require('./middleware/authorization');
const loggingMid = require('./middleware/logging');
const ENV = require('./utils').getEnvVariables();
const configuration = Utils.getConfiguration();
const portalRouter = require('./routes/portal');
const sectionRouter = require('./routes/section');
const contentItemRouter = require('./routes/contentItem');
const authenticationRouter = require('./routes/authentication');

logger.info('Environment configuration: \n' + JSON.stringify(ENV, null, 2));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(loggingMid);


mongoose.connect(Utils.getParsedDbUrl(), {useNewUrlParser: true});

// ROUTES

router.get('/health', authMid, function (req, res) {
    res.json({
        api: "UP",
        database: mongoose.connection.readyState === 1 ? "UP" : "DOWN"
    });
});

app.use('/api/portals', portalRouter);
app.use('/api/sections', sectionRouter);
app.use('/api/content_items', contentItemRouter);
app.use('/api/auth', authenticationRouter);

// SENDING EMAIL //////////////////////////////////////////

const emailService = new EmailService(ENV.MAIL_USER, ENV.MAIL_PASSWORD);

router.post('/service/email', (req, res, next) => {
    const from = req.body.from;
    const message = req.body.message;
    const title = req.body.title || configuration.email.title;
    const to = configuration.email.mail_to;

    logger.info(JSON.stringify(req.body, null, 2));

    emailService.sendEmail(from, to, message, title)
        .then(response => res.json(response))
        .catch(err => next(err));
});

// LOGS ///////////////////////////////////////////////////

router.get('/logs', authMid, (req, res, next) => {
    fs.readFile('./logs.log', (err, data) => {
        err ? next(err) : res.send(data);
    });
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

app.listen(ENV.PORT, () => {
    logger.info('Server port: ' + ENV.PORT);
    logger.info("Environment: " + ENV.ENV);
    logger.info(`Database: ${configuration.database_url}`);
});
