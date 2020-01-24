const axios = require('axios');
const { serviceUrl } = require('../constants/locations');
const { maxRetry } = require('../constants/fetch');
const sleep = require('../utils/sleep');
const logger = require('../logger')();

let retry = 0;

const fetchPublicUrl = async(workspace, graphicId, editionId, repositoryId, token) => {
  if (retry > maxRetry) throw new Error('Max retries exceeded fetching public URL');

  const URI = `${serviceUrl}/rngs/${workspace}/graphic/${graphicId}/${editionId}/${repositoryId}/url`;

  console.log('URI', URI);

  const headers = { Authorization: token };

  try {
    const response = await axios.get(URI, { headers });

    const { data } = response;

    if (data.hasError) {
      retry += 1;
      logger.warn('Retrying fetching public URL');
      await sleep();
      return fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async(
  workspace,
  graphicId,
  editionId,
  repositoryId,
  token
) => fetchPublicUrl(workspace, graphicId, editionId, repositoryId, token);
