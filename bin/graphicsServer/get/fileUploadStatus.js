const axios = require('../utils/axios');
const { GRAPHICS_API } = require('../constants/locations');
const logger = require('../../../config/utils/logger')('Graphics Server');

const getFileUploadStatus = async(id, token) => {
  logger.info('... waiting on file upload ...');
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(`${GRAPHICS_API}/graphics/v1/file-uploads/${id}`, { headers });

  if (data.status === 'Failed') {
    logger.error(data.errorDescription);
    return false;
  }
  if (data.status === 'Verified') return data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFileUploadStatus(id, token));
    }, 2000);
  });
};

module.exports = getFileUploadStatus;
