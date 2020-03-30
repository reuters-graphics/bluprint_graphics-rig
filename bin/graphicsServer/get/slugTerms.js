const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(rootSlug, token) => {
  logger.info('Fetching slug terms');
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await axios.get(`${GRAPHICS_API}/typeahead/v1/slug-terms/${rootSlug}/`, { headers });
  return data;
};
