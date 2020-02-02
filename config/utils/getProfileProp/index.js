const fs = require('fs');
const os = require('os');
const path = require('path');
const get = require('lodash/get');

const profilePath = path.join(os.homedir(), '.reuters-graphics/profile.json');

module.exports = (objPath) => {
  const pkg = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
  return get(pkg, objPath);
};
