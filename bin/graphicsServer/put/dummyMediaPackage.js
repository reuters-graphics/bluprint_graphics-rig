const fs = require('fs');
const path = require('path');
const axios = require('../utils/axios');
const getFileUploadStatus = require('../get/fileUploadStatus');
const logger = require('../../../config/utils/logger')('Graphics Server');

const putFile = async(uri, locale, token) => {
  logger.info('Uploading dummy media package');
  const headers = {
    'Content-Type': 'application/zip',
  };

  const data = fs.readFileSync(path.join(__dirname, 'dummy/media.zip'));

  try {
    const response = await axios.put(uri, data, { headers });
    return response;
  } catch (e) {
    console.log(e);
    e.response.data.errors.forEach((error) => {
      logger.error(error.error_description);
    });
  }
};

module.exports = async(uri, id, locale, token) => {
  await putFile(uri, locale, token);
  const { id: uploadedFileId } = await getFileUploadStatus(id, token);
  return uploadedFileId;
};
