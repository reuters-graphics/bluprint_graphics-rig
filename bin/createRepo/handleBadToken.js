const open = require('open');
const chalk = require('chalk');
const logger = require('../../config/utils/logger')('Create repo');

module.exports = () => {
  logger.error(chalk`Your personal access token was rejected, maybe because it has expired.

Create a new one (with "repo" permissions and SSO enabled) and then be sure to update your password in your OSX Keychain. (I've opened a few pages in your browser to help.)

Once you're done, you can re-try to create a repo by running:
{yellow $ runner repo:create}
`);
  open('https://github.com/settings/tokens', { background: true });
  open('https://help.github.com/en/github/using-git/updating-credentials-from-the-osx-keychain#updating-your-credentials-via-keychain-access', { background: true });
  process.exit(0);
};
