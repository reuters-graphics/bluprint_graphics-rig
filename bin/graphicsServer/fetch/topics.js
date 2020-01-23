const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const uniqBy = require('lodash/uniqBy');
const sleep = require('../utils/sleep');
const logger = require('../logger')();

let retry = 0;

const fetchEventData = async(eventId, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching topics');

  const URI = `${serviceUrl}/rngs/events/${eventId}`;

  const headers = { Authorization: token };

  try {
    const response = await axios.get(URI, { headers });

    const { data } = response;

    if (
      response.status !== 200 ||
      data.hasError ||
      !data.MetadataItems
    ) {
      retry += 1;
      logger.warn('Retrying fetching topics');
      await sleep();
      return fetchEventData(eventId, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(eventId, token) => {
  const event = await fetchEventData(eventId, token);
  const topics = event.MetadataItems.filter(code => (
    code.Category === 'TopicCode'
  )).map((code) => ({
    codeId: code.PermanentIdentifier,
    text: code.Code,
    mnemonic: code.Code,
  }));
  return uniqBy(topics, 'mnemonic');
};
