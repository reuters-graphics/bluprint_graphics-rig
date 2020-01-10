const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

const LOCALE_ROOT = path.resolve(__dirname, '../../../locales');

const getLocaleData = (locale) => (dataFilePath) => {
  const file = path.join(LOCALE_ROOT, locale, dataFilePath);
  if (!fs.existsSync(file)) throw new Error(`Can't find data file at ${file}`);
  const data = fs.readFileSync(file, 'utf-8');

  switch (path.extname(file)) {
    case '.json':
      return JSON.parse(data);
    case '.csv':
      return parse(data, {
        columns: true,
        skip_empty_lines: true,
      });
    default:
      return data;
  }
};

module.exports = getLocaleData;
