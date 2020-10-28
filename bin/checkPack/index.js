const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const getLocales = require('../../config/utils/getLocales');
const logger = require('../../config/utils/logger')('Check meta');

const ROOT_DIR = path.resolve(__dirname, '../../');
const LOCALES_DIR = path.resolve(ROOT_DIR, 'locales/');

const checkPack = () => {
  const filePath = path.resolve(ROOT_DIR, 'package.json');
  const packMetadata = JSON.parse(fs.readFileSync(filePath));
  if (!packMetadata.reuters.graphicId) return;

  const locales = getLocales();
  for (const locale of locales) {
    const filePath = path.resolve(LOCALES_DIR, `${locale}/metadata.json`);
    const metadata = JSON.parse(fs.readFileSync(filePath));

    if (
      !metadata.editions ||
      !metadata.editions.interactive ||
      !metadata.editions.interactive.embed ||
      !metadata.editions.interactive.page
    ) {
      logger.error(chalk`{red.underline ${locale} METADATA ERROR:} It looks like you're missing metadata for ${locale} editions in your {green.underline locales/} directory. This can happen if a graphic pack was created but an error prevented the editions from finishing.

  The metadata should be in your {green.underline locales/${locale}/metadata.json}, but if you haven't already published this page, you'll likely just want to remove the graphicId (value AND key) from package.json and retry your upload from scratch.`);
      process.exit(1);
    }
  }
};

checkPack();
