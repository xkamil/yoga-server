const log4js = require('log4js');
const logger = log4js.getLogger();
const conf = require('../configuration/configuration');
const LOG_FILE_PATH = __dirname + '/../logs.log';

log4js.configure({
    appenders: {
        file: {type: 'file', filename: LOG_FILE_PATH, maxLogSize: 1000000},
        out: {type: 'stdout'}
    },
    categories: {
        default: {
            appenders: ['file','out'], level: conf.logging_level
        }
    }
});

module.exports = logger;



