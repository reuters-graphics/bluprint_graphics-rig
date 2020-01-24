const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();

let retry = 0;

const postPack = async(workspace, graphicId, metadata, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded updating pack');

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

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying updating pack');
      await sleep();
      return postPack(workspace, graphicId, metadata, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(workspace, graphicId, metadata, token) => postPack(workspace, graphicId, metadata, token);
