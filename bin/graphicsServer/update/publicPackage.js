const axios = require('axios');
const path = require('path');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const zipDir = require('../utils/zipDir');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const putPublicPackage = async(workspace, graphicId, locale, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded updating package');

  const retryPut = async() => {
    logger.warn('Retrying updating public package');
    await sleep(); retry += 1;
    return putPublicPackage(workspace, graphicId, locale, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/package/public-${locale}.zip`;

  const headers = {
    Authorization: token,
    'Content-Type': 'application/octet-stream; charset=utf-8',
  };

  const params = {
    editionIds: '',
    updateMode: '0',
  };

  const localePkgPath = path.join(__dirname, `../../../packages/${locale}/public-${locale}/`);

  const zip = await zipDir(localePkgPath, `media-${locale}`);

  try {
    logger.info('⏳ uploading public package...');
    const response = await axios.put(URI, zip, {
      headers,
      params,
      maxContentLength: zip.byteLength,
    });

    const { data } = response;

    if (data.hasError) return retryPut();
    return data;
  } catch (e) { return catchRetry(e, retryPut); }
};

module.exports = async(workspace, graphicId, locale, token) => putPublicPackage(workspace, graphicId, locale, token);
