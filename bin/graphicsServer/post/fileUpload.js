const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

module.exports = async(fileName, token) => {
  logger.info(`Creating upload link for ${fileName}`);
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const { data } = await axios.post(`${GRAPHICS_API}/graphics/v1/file-uploads`, { fileName }, { headers });
    return data;
  } catch (e) {
    console.log(e);
    e.response.data.errors.forEach((error) => {
      logger.error(error.error_description);
    });
  }
};
