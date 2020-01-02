const copy = require('copy');
const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');

const ROOT = path.resolve(__dirname, '../../');

const copyPromise = util.promisify(copy);

const copyLocaleFiles = (locale) => {
  console.log(chalk.green(` - ${locale.toUpperCase()}`));
  return copyPromise(
      `dist/${locale}/**/*`,
      `packages/${locale}/media-interactive/public/`
  )
    .then(() => copyPromise(
      `dist/${locale}/**/*`,
      `packages/${locale}/interactive/`
    ))
    .then(() =>
      fs.copyFileSync(
        path.resolve(ROOT, 'packages/app.zip'),
        path.resolve(ROOT, `packages/${locale}/media-interactive/app.zip`)
      ))
    .catch((e) => console.log(e));
};

module.exports = copyLocaleFiles;
