const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchPack = async(workspace, graphicId, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching pack');

  const retryPost = async() => {
    logger.warn('Retrying fetching pack');
    await sleep(); retry += 1;
    return fetchPack(workspace, graphicId, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}`;

  const headers = { Authorization: token };

  try {
    const response = await axios.get(URI, { headers });

    const { data } = response;

    if (data.hasError) retryPost();

    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(workspace, graphicId, token) => fetchPack(workspace, graphicId, token);
