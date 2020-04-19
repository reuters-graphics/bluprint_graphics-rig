const fs = require('fs');
const chalk = require('chalk');
const Ajv = require('ajv');
const schema = require('./schema');
const logger = require('../../../config/utils/logger')('GoogleAPIs');

const checkConfig = (locale, configPath) => {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const ajv = new Ajv();

  const valid = ajv.validate(schema, config);
  if (!valid) {
    logger.error(chalk`Invalid Google APIs config for {green ${locale}} locale. Exiting...`);
    process.exit(0);
  }
  return config;
};

module.exports = checkConfig;
