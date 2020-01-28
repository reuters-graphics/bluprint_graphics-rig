const path = require('path');
const { readdirSync } = require('fs');
const argv = require('yargs').argv;
const logger = require('../logger')('Get locales');
const chalk = require('chalk');
const ISO6391 = require('iso-639-1');

// Allow limiting build to just one locale
const { locale: localeArg } = argv;

module.exports = () => {
  let locales = readdirSync(
    path.resolve(__dirname, '../../../locales/'),
    { withFileTypes: true }
  ).filter(dir => dir.isDirectory()).map(dir => dir.name);

  if (locales.length === 0) {
    logger.error('No locales found!');
    process.exit(1);
  }

  locales.forEach((locale) => {
    if (!ISO6391.validate(locale)) {
      logger.error(chalk`Invalid directory "{yellow ${locale}}" in locales!`);
      process.exit(1);
    }
  });

  if (localeArg && localeArg !== true) {
    if (!ISO6391.validate(localeArg)) {
      logger.error(chalk`Invalid locale arg {green.underline "${localeArg}"}.`);
    }

    locales = locales.indexOf(localeArg) > -1 ? [localeArg] : [];
    if (locales.length === 0) {
      logger.error(chalk`No locales match {green.underline "${localeArg}"}.`);
      process.exit(1);
    }
  }

  return locales;
};
