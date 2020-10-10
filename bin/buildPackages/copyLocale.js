const copy = require('copy');
const fs = require('fs');
const path = require('path');
const util = require('util');
const copyDocs = require('./copyDocs');
const chalk = require('chalk');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

const copyPromise = util.promisify(copy);

const copyLocaleFiles = (locale) => {
  logger.info(chalk`Creating {green.underline ${locale}} package.`);
  return copyPromise(
      `dist/${locale}/**/*`,
      `packages/${locale}/media-interactive/host/`
  )
    .then(() => copyPromise(
      `dist/${locale}/**/*`,
      `packages/${locale}/interactive/`
    ))
    .then(() => {
      fs.unlinkSync(path.resolve(ROOT, `packages/${locale}/media-interactive/host/index.html`));
      fs.renameSync(
        path.resolve(ROOT, `packages/${locale}/media-interactive/host/media-embed.html`),
        path.resolve(ROOT, `packages/${locale}/media-interactive/host/index.html`)
      );
      fs.copyFileSync(
        path.resolve(ROOT, 'packages/app.zip'),
        path.resolve(ROOT, `packages/${locale}/media-interactive/app.zip`)
      );
      copyDocs(locale);
    })
    .catch((e) => logger.error(e));
};

module.exports = copyLocaleFiles;
