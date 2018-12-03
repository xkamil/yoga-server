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
const authMid = require('./middleware/authorization');
const loggingMid = require('./middleware/logging');
const conf = require('./configuration/configuration');
const getHttpsCredentials = Utils.getHttpsCredentials;
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

app.use('/api/portals', require('./routes/portal'));
app.use('/api/sections', require('./routes/section'));
app.use('/api/content_items', require('./routes/contentItem'));
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/service', require('./routes/service'));
app.use('/api', require('./routes/health'));

// ERROR HANDLER //////////////////////////////////////////

router.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.type.http_status).json(err);
    } else {
        res.status(500).json(err);
    }
});

app.use('/api', router);

const httpsCredentials = getHttpsCredentials();
const server = httpsCredentials ? https.createServer(credentials, app) : app;
server.listen(conf.port, () => {
    logger.info(`HTTP${httpsCredentials ? 'S' : ''} server started on port: ${conf.port} with env: ${conf.env}`);
    logger.debug(JSON.stringify(conf, null, 3))
});



