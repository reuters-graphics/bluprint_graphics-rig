const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

const fetchTopicCode = async(topicCode, token) => {
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await axios.get(`${GRAPHICS_API}/typeahead/v1/topic-codes/${topicCode}/`, { headers });
  return data;
};

module.exports = (topicCodes, token) => {
  logger.info('Fetching topic codes');
  return Promise.all(topicCodes.map(async(topicCode) => fetchTopicCode(topicCode, token)));
};
