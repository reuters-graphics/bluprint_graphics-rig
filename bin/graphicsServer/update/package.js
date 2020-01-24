const axios = require('axios');
const path = require('path');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();
const AdmZip = require('adm-zip');

let retry = 0;

const createZip = (locale) => {
  const zip = new AdmZip();

  const localePkgPath = path.join(__dirname, `../../../packages/${locale}/`);

  zip.addLocalFolder(localePkgPath);

  return zip.toBuffer();
};

const postPackage = async(workspace, graphicId, locale, editionIds, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded updating package');

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/package/media-${locale}.zip`;

  const headers = {
    Authorization: token,
    'Content-Type': 'application/octet-stream; charset=utf-8',
  };

  const params = {
    editionIds: '',
    updateMode: '0',
  };

  const zipBuffer = createZip(locale);

  // Set upper limit to size of zip in bytes
  const maxContentLength = zipBuffer.byteLength;

  try {
    logger.info('uploading package...');
    const response = await axios.put(URI, zipBuffer, { headers, params, maxContentLength });

    const { data } = response;

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying updating package');
      await sleep();
      return postPackage(workspace, graphicId, locale, editionIds, token);
    }
    return data;
  } catch (e) {
    console.log(e.response);
    console.log(e.response.data);
    console.log(e.response.headers);
    throw new Error(e);
  }
};

module.exports = async(workspace, graphicId, locale, editionIds, token) => postPackage(workspace, graphicId, locale, editionIds, token);
