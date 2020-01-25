const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const postPack = async(metadata, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded creating pack');

  const URI = `${serviceUrl}/rngs/graphic`;

  const headers = { Authorization: token };

  try {
    const response = await axios.post(URI, metadata, { headers });

    const { data } = response;

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying creating pack');
      await sleep();
      return postPack(metadata, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(metadata, token) => postPack(metadata, token);
