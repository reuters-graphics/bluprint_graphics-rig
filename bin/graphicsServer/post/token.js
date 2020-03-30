const axios = require('../utils/axios');
const { CREDENTIALS_API } = require('../constants/locations');
const getCredentials = require('../utils/getCredentials');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async() => {
  logger.info('Creating token');
  const { username, password } = getCredentials();

  const data = {
    credentials: Buffer.from(`${username}:${password}`).toString('base64'),
  };

  const headers = {
    'X-Api-Key': 'kiCzVRBetr82Fru8bla1d6m4z0H4lmVxaeWX1wAU',
  };

  const response = await axios.post(`${CREDENTIALS_API}/auth/token`, data, { headers });
  const { Token } = response.data;
  return Token;
};
