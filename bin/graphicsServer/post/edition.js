const axios = require('../utils/axios');
const getEditionStatus = require('../get/editionStatus');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(graphicId, fileId, token) => {
  logger.info('Creating edition');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.post(`${GRAPHICS_API}/graphics/v1/graphics/${graphicId}/editions`, { fileId }, { headers });

    const taskUri = response.headers.location;
    const data = await getEditionStatus(taskUri, token);
    return data;
  } catch ({ response }) {
    response.data.errors.forEach((error) => {
      logger.error(error.error_description);
    });
  }
};
