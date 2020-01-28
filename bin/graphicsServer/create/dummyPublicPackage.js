const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const zipFiles = require('../utils/zipFiles');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const postDummyPackage = async(workspace, graphicId, locale, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded creating public package');

  const retryPost = async() => {
    logger.warn('Retrying creating public package');
    await sleep(); retry += 1;
    return postDummyPackage(workspace, graphicId, locale, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/package/public-${locale}.zip`;

  const headers = {
    Authorization: token,
    'Content-Type': 'application/octet-stream; charset=utf-8',
  };

  const files = {};

  const INDEX = `public-${locale}/interactive/index.html`;

  files[INDEX] = '<html></html>';

  const dummyZip = await zipFiles(files);

  try {
    const response = await axios.post(URI, dummyZip, { headers });

    const { data } = response;

    if (data.hasError) return retryPost();

    return data;
  } catch (e) { return catchRetry(e, retryPost); }
};

module.exports = async(workspace, graphicId, locale, token) => postDummyPackage(workspace, graphicId, locale, token);
