const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const askJSON = require('ask-json');
const JSONschema = require('./schema');
const logger = require('../../../config/utils/logger')('Check meta');

const PACKAGE_DIR = path.resolve(__dirname, '../../../');

const checkPackage = async(locales) => {
  const filePath = path.resolve(PACKAGE_DIR, 'package.json');
  const metadata = JSON.parse(fs.readFileSync(filePath));
  logger.info('Package metadata.');

  if (metadata.reuters.publishDate) {
    JSONschema.properties.reuters.required.push('updateDate');
    delete metadata.reuters.updateDate;
  }

  const data = await askJSON(JSONschema, metadata, { askToAddItems: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  logger.info(`✏️  If you need to edit this data, do it in ${chalk.yellow('package.json')}.`);
};

module.exports = checkPackage;
