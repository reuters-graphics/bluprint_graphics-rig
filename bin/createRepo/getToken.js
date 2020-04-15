const keychain = require('keychain');
const logger = require('../../config/utils/logger')('Create repo');

module.exports = (username) => new Promise((resolve, reject) => {
  keychain.getPassword({ account: username, service: 'github.com', type: 'internet' }, (err, password) => {
    if (err) {
      logger.info('Error creating repo for project. Couldn\'t get a GitHub token from your keychain.');
      process.exit(0);
    }
    resolve(password);
  });
});
