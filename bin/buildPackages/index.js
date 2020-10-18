const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const simpleGit = require('simple-git/promise');
const getLocales = require('../../config/utils/getLocales');
const copyLocaleFiles = require('./copyLocale');
const makeGfxShare = require('./makeGfxShare');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const DIST_DIR = path.join(ROOT, 'dist');

const git = simpleGit(ROOT);

const run = async() => {
  logger.info('Building client packages...');

  const locales = getLocales();

  if (!fs.existsSync(PACKAGES_DIR)) fs.mkdirSync(PACKAGES_DIR);
  if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

  await git.add('.');
  await git.commit('Pre-archive');

  logger.info('Creating archive.');
  spawnSync('git', ['archive', '-o', 'packages/app.zip', 'HEAD', '.', ':!project-files'], { cwd: ROOT });

  logger.info('Copying locales.');
  await Promise.all(locales.map((locale) => copyLocaleFiles(locale)));

  logger.info('Making preview images.');
  await Promise.all(locales.map((locale) => makeGfxShare(locale)));

  fs.unlinkSync(path.join(ROOT, 'packages/app.zip'));

  logger.info('✅ Done.\n');
};

run();
