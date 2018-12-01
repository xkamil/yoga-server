const ApiError = require('./error').ApiError;
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const Utils = require('./utils');
const logger = require('./libs/logger');
const EmailService = require('./service/emailService');
const fs = require('fs');
const authMid = require('./middleware/authorization');
const loggingMid = require('./middleware/logging');
const conf = require('./configuration/configuration');
const getHttpsCredentials = Utils.getHttpsCredentials;
const portalRouter = require('./routes/portal');
const sectionRouter = require('./routes/section');
const contentItemRouter = require('./routes/contentItem');
const authenticationRouter = require('./routes/authentication');
const https = require('https');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(loggingMid);


mongoose.connect(conf.database_uri, {useNewUrlParser: true});

// ROUTES

const request = require('request');
const username = '915629246747733';
const password = 'EMNYQ5vwrLxDNVHBPAUe3Vh3cF8';

router.get("/images", authMid, (req, res, next) => {
    request.get('http://api.cloudinary.com:80/v1_1/duvsjgmt5/resources/image', {
        headers: {"Authorization": Buffer.from(username + ':' + password).toString('base64')}
    }, (err, response, body) => {
        if (err) {
            next(err);
        } else if (response.statusCode === 200) {
            res.status(200).json(JSON.parse(body))
        }
    })
});

router.get('/health', authMid, function (req, res) {
    res.json({
        api: "UP",
        database: mongoose.connection.readyState === 1 ? "UP" : "DOWN"
    });
});

router.get('/validate_token', authMid, function (req, res) {
    res.send('');
});

app.use('/api/portals', portalRouter);
app.use('/api/sections', sectionRouter);
app.use('/api/content_items', contentItemRouter);
app.use('/api/auth', authenticationRouter);

// SENDING EMAIL //////////////////////////////////////////

const emailService = new EmailService(conf.email_server.username, conf.email_server.password);

router.post('/service/email', (req, res, next) => {
    const from = req.body.from;
    const message = req.body.message;
    const title = req.body.title || conf.email.title;
    const to = conf.email.mail_to;

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


getHttpsCredentials()
    .then(credentials => {
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(conf.port, () => {
            logger.info('Server protocol: https');
            logger.info('Server port: ' + conf.port);
            logger.info("Environment: " + conf.env);
            logger.debug(JSON.stringify(conf, null, 3))
        });
    })
    .catch(err => {
        logger.error("Unable to start https server: ", err.message);

        app.listen(conf.port, () => {
            logger.info('Server protocol: http');
            logger.info('Server port: ' + conf.port);
            logger.info("Environment: " + conf.env);
            logger.debug('Configuration: \n', JSON.stringify(conf, null, 3))
        })
    });



