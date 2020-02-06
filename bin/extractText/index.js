const xgettext = require('xgettext-template/index.js');
const initPo = require('ttag-cli/dist/src/commands/init').default;
const updatePo = require('ttag-cli/dist/src/commands/update').default;
const glob = require('glob');
const path = require('path');
const { existsSync } = require('fs');
const argv = require('yargs').argv;
const getLocales = require('../../config/utils/getLocales');
const chalk = require('chalk');
const logger = require('../../config/utils/logger')('Extract text');

const LOCALES_DIR = path.resolve(__dirname, '../../locales/');

const locales = getLocales();

const ejsFiles = glob.sync('src/html/**/*.ejs');
const htmlFiles = glob.sync('src/html/**/*.html');

const templateFiles = ejsFiles.concat(htmlFiles);

const writeGettextPo = (locale) => {
  const output = path.resolve(LOCALES_DIR, `${locale}/messages.gettext.po`);
  // Make po file if it doesn't exist or user passes --reset
  if (!existsSync(output) || argv.reset) initPo(locale, output);

  xgettext(templateFiles, {
    output,
    language: 'ejs',
    'join-existing': true,
    keyword: 'gt.gettext',
  }, () => {});
};

const writeTtagPo = (locale) => {
  const output = path.resolve(LOCALES_DIR, `${locale}/messages.ttag.po`);
  const scriptFiles = glob.sync('src/js/**/*.{js,ejs}');
  // Make po file if it doesn't exist or user passes --reset
  if (!existsSync(output) || argv.reset) initPo(locale, output);

  updatePo(output, scriptFiles);
};

logger.info('Extracting translatable text...');

locales.forEach((locale) => {
  logger.info(chalk`📖 {green.underline ${locale}} text`);
  writeGettextPo(locale);
  writeTtagPo(locale);
});
console.log('\n');
logger.info('✅ Done.\n');
