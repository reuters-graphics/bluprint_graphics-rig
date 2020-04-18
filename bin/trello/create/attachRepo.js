const os = require('os');
const fs = require('fs');
const path = require('path');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const axios = require('axios');
const logger = require('../../../config/utils/logger')('Trello');

module.exports = async(cardId) => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/secrets.json');
  const credFile = fs.readFileSync(credFilePath);
  const { trelloApiKey: key, trelloApiToken: token } = JSON.parse(credFile);

  const gitOrigin = await gitRemoteOriginUrl();

  if (!gitOrigin) {
    logger.info('Unable to attach GitHub repo link to Trello card');
    return;
  }

  const url = gitOrigin.replace('https://api.github.com/repos', 'https://github.com');
  const name = 'GitHub';

  await axios.post(`https://api.trello.com/1/cards/${cardId}/attachments`,
    { name, url },
    { params: { key, token } }
  );
};
