const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

const getGraphic = async(id, token) => {
  logger.info('Getting graphic');
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(`${GRAPHICS_API}/graphics/v1/graphics/${id}`, { headers });

  // Only return graphic if it has our editions,
  // otherwise we wait...
  if (data.editions.length >= 3) return data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getGraphic(id, token));
    }, 2000);
  });
};

module.exports = getGraphic;
