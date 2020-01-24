const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();
const AdmZip = require('adm-zip');

let retry = 0;

const createDummyZip = (locale) => {
  const zip = new AdmZip();

  zip.addFile(
    `${locale}/media-interactive/README.txt`,
    Buffer.from('readme')
  );
  zip.addFile(
    `${locale}/interactive/index.html`,
    Buffer.from('<html></html>')
  );
  return zip.toBuffer();
};

const postDummyPackage = async(workspace, graphicId, locale, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded creating package');

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/package/media-${locale}.zip`;

  const headers = {
    Authorization: token,
    'Content-Type': 'application/octet-stream; charset=utf-8',
  };

  const dummyZip = createDummyZip(locale);

  try {
    const response = await axios.post(URI, dummyZip, { headers });

    const { data } = response;

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying creating package');
      await sleep();
      return postDummyPackage(workspace, graphicId, locale, token);
    }
    return data;
  } catch (e) {
    console.log('ERR', e);
    throw new Error(e);
  }
};

module.exports = async(workspace, graphicId, locale, token) => postDummyPackage(workspace, graphicId, locale, token);
