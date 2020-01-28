const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const putPack = async(workspace, graphicId, metadata, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded updating pack');

  const retryPut = async() => {
    logger.warn('Retrying updating pack');
    await sleep(); retry += 1;
    return putPack(workspace, graphicId, metadata, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}`;

  const headers = { Authorization: token };

  const { graphic } = metadata;
  const { title, description, byline, slugline, topicCodes, location, editions } = graphic;

  const payload = {
    graphic: {
      graphicId,
      title,
      description,
      byline,
      slugline,
      editions,
      topicCodes,
      location,
      changed: true,
    },
  };

  try {
    const response = await axios.put(URI, payload, { headers });

    const { data } = response;

    if (data.hasError) return retryPut();

    return data;
  } catch (e) { return catchRetry(e, retryPut); }
};

module.exports = async(workspace, graphicId, metadata, token) => putPack(workspace, graphicId, metadata, token);
