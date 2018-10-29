const log4js = require('log4js');
const logger = log4js.getLogger();
const fs = require('fs');
const path = require('path');

function getConfiguration() {
    if (!this.configuration) {
        this.configuration = require(`./configuration/${getEnvVariables().ENV}.json`);
    }
    return this.configuration;
}

function getEnvVariables() {
    return {
        PORT: process.env.PORT || 8080,
        ENV: process.env.ENV || 'dev',
        MAIL_USER: process.env.MAIL_USER || '',
        MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
        KARMA_USER: process.env.KARMA_USER || 'admin',
        KARMA_PASSWORD: process.env.KARMA_PASSWORD || 'admin',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        JWT_SECRET: process.env.JWT_SECRET || 'ghdj456'
    }
}

function getParsedDbUrl() {
    const ENV = getEnvVariables();

    if (getConfiguration().database_url.indexOf('<dbuser>') !== -1) {
        let databaseUrl = getConfiguration().database_url;
        databaseUrl = databaseUrl.replace('<dbuser>', ENV.DB_USER);
        databaseUrl = databaseUrl.replace('<dbpassword>', ENV.DB_PASSWORD);
        return databaseUrl;
    }
    return getConfiguration().database_url;
}

function getLogger() {
    if (!this.configured) {

        log4js.configure({
            appenders: {
                everything: {type: 'file', filename: 'logs.log', maxLogSize: 1000000}
            },
            categories: {
                default: {appenders: ['everything'], level: 'debug'}
            }
        });

        logger.level = getConfiguration().logging_level;
        this.configured = true;
    }

    return logger;
}

function getHttpsCredentials() {
    return new Promise((resolve, reject) => {
        try {
            const credentials = {
                    key: fs.readFileSync(path.join(__dirname, '/certs/cert.key')),
                    cert: fs.readFileSync(path.join(__dirname, '/certs/cert.crt'))
                };

            resolve(credentials);

        } catch (e) {
            reject(e);
        }
    });


}

module.exports = {
    getConfiguration,
    getParsedDbUrl,
    getLogger,
    getEnvVariables,
    getHttpsCredentials
};