const checkServer = require('./server');
const logger = require('../../config/utils/logger')('Check credentials');

const checkCreds = async() => {
  logger.info('Reseting your server credentials...');
  await checkServer();
  logger.info('✅ Done.\n');
};

checkCreds();
