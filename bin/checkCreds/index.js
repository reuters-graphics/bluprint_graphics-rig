const checkAWS = require('./aws');
const checkProfile = require('./profile');
const checkServer = require('./server');
const logger = require('../../config/utils/logger')('Check credentials');

const checkCreds = async() => {
  logger.info('Checking you have all the credentials you need...');
  await checkAWS();
  await checkProfile();
  await checkServer();
  logger.info('✅ Done.\n');
};

checkCreds();
