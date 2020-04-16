const os = require('os');
const fs = require('fs');
const path = require('path');
const Trello = require('trello');

module.exports = () => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/secrets.json');
  const credFile = fs.readFileSync(credFilePath);
  const { trelloApiKey, trelloApiToken } = JSON.parse(credFile);
  return new Trello(trelloApiKey, trelloApiToken);
};
