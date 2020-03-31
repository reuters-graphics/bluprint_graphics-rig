const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/graphics-server.json');
  const credFile = fs.readFileSync(credFilePath);
  return JSON.parse(credFile);
};
