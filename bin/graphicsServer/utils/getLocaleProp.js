const fs = require('fs');
const path = require('path');
const get = require('lodash/get');

module.exports = (locale) => (objPath) => {
  const localePath = path.resolve(__dirname, `../../../locales/${locale}/metadata.json`);
  const localeMetadata = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
  return get(localeMetadata, objPath);
};
