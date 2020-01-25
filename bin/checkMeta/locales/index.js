const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const askJSON = require('ask-json');
const JSONschema = require('./schema');
const getLocales = require('../../../config/utils/getLocales');
const logger = require('../../../config/utils/logger')('Check meta');

const LOCALES_DIR = path.resolve(__dirname, '../../../locales/');

const checkLocales = async() => {
  const locales = getLocales();
  for (const locale of locales) {
    const filePath = path.resolve(LOCALES_DIR, `${locale}/metadata.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
    };

    const metadata = JSON.parse(fs.readFileSync(filePath));

    logger.info(`Checking METADATA for ${chalk.underline.green(locale)} locale...`);
    const data = await askJSON(JSONschema, metadata);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  logger.info(`✏️  If you need to edit this data, do it in ${chalk.yellow('locales/<locale>/metadata.json')}.`);
};

module.exports = checkLocales;
