const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const credFilePath = path.join(os.homedir(), '.reuters-graphics/profile.json');
  if (!fs.existsSync(credFilePath)) throw new Error('Can\'t find graphics user profile');
  const credFile = fs.readFileSync(credFilePath);
  return JSON.parse(credFile);
};
