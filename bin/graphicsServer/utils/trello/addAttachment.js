const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const getPkgProp = require('../../../../config/utils/getPackageProp');

module.exports = (name, url) => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/secrets.json');
  const credFile = fs.readFileSync(credFilePath);
  const { trelloApiKey: key, trelloApiToken: token } = JSON.parse(credFile);

  const cardId = getPkgProp('reuters.trello.card');

  if (!cardId) return;

  axios.post(`https://api.trello.com/1/cards/${cardId}/attachments`,
    { name, url },
    { params: { key, token } }
  );
};
