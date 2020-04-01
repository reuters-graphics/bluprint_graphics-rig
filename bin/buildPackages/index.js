const path = require('path');
const fs = require('fs');
const getLocales = require('../../config/utils/getLocales');
const makeArchive = require('./makeArchive');
const copyLocaleFiles = require('./copyLocale');
const redirectEmbeds = require('./redirectEmbeds');
const makeGfxShare = require('./makeGfxShare');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

logger.info('Building client packages...');

const archivePath = path.resolve(ROOT, 'packages/app.zip');

const outputStream = fs.createWriteStream(archivePath);

const locales = getLocales();

outputStream.on('finish', async() => {
  await Promise.all(locales.map((locale) => copyLocaleFiles(locale)));

  // if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);

  logger.info('Redirecting embeds.');
  await Promise.all(locales.map((locale) => redirectEmbeds(locale)));

  logger.info('Making preview images.');
  await Promise.all(locales.map((locale) => makeGfxShare(locale)));

  logger.info('✅ Done.\n');
});

makeArchive(outputStream);
