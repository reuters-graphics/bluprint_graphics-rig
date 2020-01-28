const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const catchRetry = require('../utils/catchRetry');
const logger = require('../../../config/utils/logger')('Graphics Server');

let retry = 0;

const fetchPublicUrl = async(workspace, graphicId, editionId, repositoryId, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching public URL');

  const retryGet = async() => {
    logger.warn('Retrying fetching public URL');
    await sleep(); retry += 1;
    return fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
  };

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/${editionId}/${repositoryId}/url`;

  const headers = { Authorization: token };

  try {
    const response = await axios.get(URI, { headers });

    const { data } = response;

    if (data.hasError) return retryGet();

    return data;
  } catch (e) { return catchRetry(e, retryGet); }
};

module.exports = async(
  workspace,
  graphicId,
  editionId,
  repositoryId,
  token
) => fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
