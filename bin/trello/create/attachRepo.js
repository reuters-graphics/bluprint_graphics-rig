const os = require('os');
const fs = require('fs');
const path = require('path');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const hostedGitInfo = require('hosted-git-info');
const axios = require('axios');

module.exports = async(cardId) => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/secrets.json');
  const credFile = fs.readFileSync(credFilePath);
  const { trelloApiKey: key, trelloApiToken: token } = JSON.parse(credFile);

  const gitOrigin = await gitRemoteOriginUrl();
  const info = hostedGitInfo.fromUrl(gitOrigin);
  const url = info.docs();
  const name = 'GitHub';

  await axios.post(`https://api.trello.com/1/cards/${cardId}/attachments`,
    { name, url },
    { params: { key, token } }
  );
};
