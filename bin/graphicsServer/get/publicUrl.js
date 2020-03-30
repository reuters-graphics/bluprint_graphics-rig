const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(graphicId, editionId, token) => {
  logger.info('Fetching public URL');
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await axios.get(`${GRAPHICS_API}/graphics/v1/graphics/${graphicId}/editions/${editionId}/publishing-locations/public-rngs/`, { headers });
  return data;
};
