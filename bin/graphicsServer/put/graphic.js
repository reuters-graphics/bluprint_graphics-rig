const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(graphicId, graphic, token) => {
  logger.info('Updating graphic');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const { data } = await axios.put(`${GRAPHICS_API}/graphics/v1/graphics/${graphicId}`, graphic, { headers });

    return data;
  } catch ({ response }) {
    response.data.errors.forEach((error) => {
      logger.error(error.error_description);
    });
  }
};
