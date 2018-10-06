const log4js = require('log4js');
const logger = log4js.getLogger();

function getConfiguration() {
    if(!this.configuration){
        this.configuration = require(`./configuration/${getEnv()}.json`);
    }
    return this.configuration;
}

function getParsedDbUrl() {
    if (getConfiguration().database_url.indexOf('<dbuser>') !== -1) {
        let databaseUrl = '';
        databaseUrl = databaseUrl.replace('<dbuser>', process.env.DB_USER);
        databaseUrl = databaseUrl.replace('<dbpassword>', process.env.DB_PASSWORD);
        return databaseUrl;
    }
    return getConfiguration().database_url;
}

function getEnv() {
    return process.env.ENV || "DEV";
}

function getLogger() {
    if(!this.configured){
        logger.level = getConfiguration().logging_level;
        this.configured = true;
    }
    
    return logger;
}

module.exports = {
    getConfiguration,
    getParsedDbUrl,
    getEnv,
    getLogger
};