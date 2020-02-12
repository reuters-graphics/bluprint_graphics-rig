const axios = require('axios');
const { createFsFromVolume, Volume } = require('memfs');
const hostedGitInfo = require('hosted-git-info');
const getParser = require('./parser');
const fs = require('fs');
const path = require('path');
const paths = require('./constants');
const logger = require('../../config/utils/logger')('ai2html');

const memfs = createFsFromVolume(new Volume());

const REPO = 'reuters-graphics/ai2html';

const gitInfo = hostedGitInfo.fromUrl(REPO);

const downloadRepo = async() => {
  const response = await axios.get(gitInfo.tarball(), {
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(getParser(resolve, reject, memfs));
  });
};

const getFiles = async() => {
  logger.info('Fetching ai2html repo...');
  await downloadRepo();
  const TEMPLATE = memfs.readFileSync(paths.github.TEMPLATE);
  fs.writeFileSync(paths.system.TEMPLATE, TEMPLATE);
};

const writeFiles = () => {
  const TEMPLATE = memfs.readFileSync(paths.github.TEMPLATE);
  const SCRIPT = memfs.readFileSync(paths.github.SCRIPT);

  logger.info('Copying ai2html template...');
  fs.writeFileSync(paths.system.TEMPLATE, TEMPLATE);

  logger.info('Updating ai2html script...');
  if (fs.existsSync(path.dirname(paths.system.SCRIPT))) {
    fs.writeFileSync(paths.system.SCRIPT, SCRIPT);
  } else {
    logger.warn('Can\'t find Illustrator scripts directory on your system.');
    logger.warn('You may need to update Illustrator.');
  }
};

const getAIScripts = async() => {
  await getFiles();
  writeFiles();
  logger.info('✅ Done.\n');
};

getAIScripts();
