const path = require('path');
const { spawnSync } = require('child_process');
const simpleGit = require('simple-git/promise');
const getLocales = require('../../config/utils/getLocales');
const copyLocaleFiles = require('./copyLocale');
const makeGfxShare = require('./makeGfxShare');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

const git = simpleGit(ROOT);

const run = async() => {
  logger.info('Building client packages...');

  const locales = getLocales();

  await git.add('.');
  await git.commit('Pre-archive');

  logger.info('Creating archive.');
  spawnSync('git', ['archive', '-o', 'packages/app.zip', 'HEAD', '.', ':!project-files'], { cwd: ROOT });

  logger.info('Copying locales.');
  await Promise.all(locales.map((locale) => copyLocaleFiles(locale)));

  logger.info('Making preview images.');
  await Promise.all(locales.map((locale) => makeGfxShare(locale)));

  logger.info('✅ Done.\n');
};

run();
