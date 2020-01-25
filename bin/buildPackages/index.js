const path = require('path');
const fs = require('fs');
const getLocales = require('../../config/utils/getLocales');
const makeArchive = require('./makeArchive');
const copyLocaleFiles = require('./copyLocale');
const redirectEmbeds = require('./redirectEmbeds');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

const outputStream = fs.createWriteStream(path.resolve(
  ROOT, 'packages/app.zip'
));

const locales = getLocales();

outputStream.on('finish', async() => {
  logger.info('⚙️  Copying locale files.');
  await Promise.all(
    locales.map((locale) => copyLocaleFiles(locale))
  )
    .then(() => {
      fs.unlinkSync('packages/app.zip');
      logger.info('⚙️  Redirecting embeds.');
      locales.forEach((locale) => redirectEmbeds(locale));
    })
    .catch((e) => logger.error(e));
});

makeArchive(outputStream);
