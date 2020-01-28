const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');
const prompts = require('prompts');

let retry = 0;

const publishPack = async(workspace, graphicId, locale, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded publishing pack');

  const retryPut = async() => {
    logger.warn('Retrying publishing pack');
    await sleep(); retry += 1;
    return publishPack(workspace, graphicId, locale, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/publish`;

  const headers = {
    Authorization: token,
    'Content-Type': 'application/octet-stream; charset=utf-8',
  };

  const params = {
    editionIds: '',
    updateMode: '0',
  };

  try {
    logger.info('⏳ publishing public package...');
    const response = await axios.put(URI, '', { headers, params });

    const { data } = response;

    if (data.hasError) return retryPut();

    return data;
  } catch (e) { return catchRetry(e, retryPut); }
};

module.exports = async(workspace, graphicId, locale, token) => {
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure you want to publish this project?',
  });

  if (!confirm) return;

  return publishPack(workspace, graphicId, locale, token);
};
