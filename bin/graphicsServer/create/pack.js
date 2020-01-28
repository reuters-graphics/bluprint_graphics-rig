const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const postPack = async(metadata, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded creating pack');

  const retryPost = async() => {
    logger.warn('Retrying creating pack');
    await sleep(); retry += 1;
    return postPack(metadata, token);
  };

  const URI = `${serviceUrl}/rngs/graphic`;

  const headers = { Authorization: token };

  try {
    const response = await axios.post(URI, metadata, { headers });

    const { data } = response;

    if (data.hasError) return retryPost();

    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(metadata, token) => postPack(metadata, token);
