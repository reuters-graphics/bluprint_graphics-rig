const fs = require('fs');
const path = require('path');
const set = require('lodash/set');

const pkgPath = path.resolve(__dirname, '../../../package.json');

module.exports = (objPath, value) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  set(pkg, objPath, value);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
};
