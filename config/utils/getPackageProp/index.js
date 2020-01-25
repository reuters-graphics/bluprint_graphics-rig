const fs = require('fs');
const path = require('path');
const get = require('lodash/get');

const pkgPath = path.resolve(__dirname, '../../../package.json');

module.exports = (objPath) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return get(pkg, objPath);
};
