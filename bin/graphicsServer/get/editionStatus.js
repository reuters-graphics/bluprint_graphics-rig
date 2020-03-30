const axios = require('../utils/axios');
const logger = require('../../../config/utils/logger')('Graphics Server');

const getEditionStatus = async(uri, token) => {
  logger.info('... waiting on edition ...');
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(uri, { headers });

  if (data.status === 'Failed') {
    logger.error(data.errorDescription);
    return false;
  }
  if (data.status === 'Completed') return data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getEditionStatus(uri, token));
    }, 2000);
  });
};

module.exports = getEditionStatus;
