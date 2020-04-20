const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const checkConfig = require('./common/checkConfig');
const writeData = require('./common/writeData');
const getDoc = require('./docs');
const getSheet = require('./sheets');
const getLocales = require('../../config/utils/getLocales');
const logger = require('../../config/utils/logger')('GoogleAPIs');

const LOCALES_DIR = path.resolve(__dirname, '../../locales/');
const locales = getLocales();

const getGoogleAPIsForLocale = async(locale) => {
  logger.info(chalk`{green ${locale.toUpperCase()}}:`);

  const LOCALE_DIR = path.join(LOCALES_DIR, locale);
  const configPath = path.join(LOCALE_DIR, 'google.json');

  if (!fs.existsSync(configPath)) {
    logger.warn(chalk`No Google APIs config found at {yellow ${locale}/google.json}. Skipping...`);
    return;
  }

  const { docs, sheets } = checkConfig(locale, configPath);

  if (!docs && !sheets) {
    logger.warn(chalk`No Google Sheets or Docs registered in {yellow ${locale}/google.json}.`);
    return;
  }

  if (docs) {
    for (const doc in docs) {
      const documentId = docs[doc];
      const data = await getDoc(doc, documentId);
      if (!data) continue;
      const writePath = path.join(LOCALE_DIR, doc);
      logger.info(chalk`- ${doc}`);
      writeData(writePath, data);
    }
  }

  if (sheets) {
    for (const sheet in sheets) {
      const sheetId = sheets[sheet];
      const data = await getSheet(sheet, sheetId);
      if (!data) continue;
      const writePath = path.join(LOCALE_DIR, sheet);
      logger.info(chalk`- ${sheet}`);
      writeData(writePath, data);
    }
  }
};

const run = async() => {
  logger.info('Getting Google APIs data...');
  for (const locale of locales) {
    await getGoogleAPIsForLocale(locale);
  }
  logger.info('✅ Done.\n');
};

run();
