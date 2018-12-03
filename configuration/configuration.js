const YAML = require('yamljs');
const fs = require('fs');
const DEFAULT_CONF = YAML.load(__dirname + '/default_configuration.yaml');
const CUSTOM_CONF_PATH = __dirname + '/configuration.yaml';
let customConf = {};

if (fs.existsSync(CUSTOM_CONF_PATH)) {
    customConf = YAML.load(CUSTOM_CONF_PATH);
}

const conf = {...DEFAULT_CONF, ...customConf};
const envConf = {...conf.default, ...conf[conf.environment]};

console.log(envConf);

module.exports = envConf;