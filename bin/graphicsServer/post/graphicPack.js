const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(graphic, token) => {
  logger.info('Creating graphic');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const { data } = await axios.post(`${GRAPHICS_API}/graphics/v1/graphics`, graphic, { headers });
    return data;
  } catch ({ response }) {
    response.data.errors.forEach((error) => {
      logger.error(error.error_description);
    });
  }
};
