const path = require('path');
const fs = require('fs');
const axios = require('../utils/axios');
const zipDir = require('../utils/zipDir');
const getFileUploadStatus = require('../get/fileUploadStatus');
const logger = require('../../../config/utils/logger')('Graphics Server');

const putFile = async(uri, locale, token) => {
  logger.info('Updating media package');
  const headers = {
    'Content-Type': 'application/zip',
  };

  const localePkgPath = path.join(__dirname, `../../../packages/${locale}/media-${locale}/`);

  // Temporarily removing ZIP files until config is changed in graphics server
  const appZip = path.join(localePkgPath, 'media-interactive/app.zip');
  if (fs.existsSync(appZip)) fs.unlinkSync(appZip);
  // end temp

  const zip = await zipDir(localePkgPath, `media-${locale}`);

  try {
    const response = await axios.put(uri, zip, { headers });
    return response;
  } catch (e) {
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
