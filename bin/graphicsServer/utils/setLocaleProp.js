const fs = require('fs');
const path = require('path');
const set = require('lodash/set');

module.exports = (locale) => (objPath, value) => {
  const localePath = path.resolve(__dirname, `../../../locales/${locale}/metadata.json`);
  const localeMetadata = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
  set(localeMetadata, objPath, value);
  fs.writeFileSync(localePath, JSON.stringify(localeMetadata, null, 2));
};
