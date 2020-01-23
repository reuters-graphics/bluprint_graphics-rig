const axios = require('axios');
const { serviceUrl } = require('./constants/locations');
const { maxRetry } = require('./constants/fetch');
const sleep = require('./utils/sleep');
const logger = require('./logger')();

let retry = 0;

const postGraphicMeta = async(metadata, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded creating graphic');

  const URI = `${serviceUrl}/rngs/graphic`;

  const headers = { Authorization: token };

  try {
    const response = await axios.post(URI, metadata, { headers });

    const { data } = response;

    console.log('RESPONSE', response);

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying posting graphic metadata');
      await sleep();
      return postGraphicMeta(metadata, token);
    }
    return data;
  } catch (e) {
    console.log('ERR', e);
    throw new Error(e);
  }
};

module.exports = async(metadata, token) => postGraphicMeta(metadata, token);
