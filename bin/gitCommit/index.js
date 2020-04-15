const simpleGit = require('simple-git/promise');
const logger = require('../../config/utils/logger')('Git commit');

const git = simpleGit();

const run = async() => {
  logger.info('Committing and pushing to GitHub');
  await git.add('.');
  await git.commit(`Uploaded at ${new Date().toGMTString()}`);
  try {
    await git.push('origin', 'master');
  } catch (err) {
    logger.error('Unable to push to GitHub');
    console.log(err);
  }
};

run();
