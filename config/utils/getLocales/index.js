const path = require('path');
const { readdirSync } = require('fs');

module.exports = () => readdirSync(
  path.resolve(__dirname, '../../../locales/'),
  { withFileTypes: true }
).filter(dir => dir.isDirectory()).map(dir => dir.name);
