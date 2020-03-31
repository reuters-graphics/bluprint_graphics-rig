const axios = require('../utils/axios');
const getEditionStatus = require('../get/editionStatus');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(graphicId, fileId, editions, modified, token) => {
  logger.info('Updating edition');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.put(`${GRAPHICS_API}/graphics/v1/graphics/${graphicId}/editions`, {
      fileId,
      editions,
      modified,
    }, { headers });

    const taskUri = response.headers.location;
    const data = await getEditionStatus(taskUri, token);
    return data;
  } catch ({ response }) {
    logger.error(response.data.error_description);
  }
};
