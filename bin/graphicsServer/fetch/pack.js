const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchPack = async(workspace, graphicId, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching pack');

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}`;

  const headers = { Authorization: token };

  try {
    const response = await axios.get(URI, { headers });

    const { data } = response;

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying fetching pack');
      await sleep();
      return fetchPack(workspace, graphicId, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(workspace, graphicId, token) => fetchPack(workspace, graphicId, token);
