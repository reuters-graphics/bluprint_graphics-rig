const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../../../package.json');

module.exports = (update) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const updatedPkg = Object.assign({}, pkg, update);
  fs.writeFileSync(pkgPath, JSON.stringify(updatedPkg, null, 2));
};
