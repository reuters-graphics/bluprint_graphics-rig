const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const askJSON = require('ask-json');
const JSONschema = require('./schema');

const PACKAGE_DIR = path.resolve(__dirname, '../../../');

const checkPackage = async(locales) => {
  const filePath = path.resolve(PACKAGE_DIR, 'package.json');
  const metadata = JSON.parse(fs.readFileSync(filePath));
  console.log('\n⚙️  Checking METADATA for package...');
  const data = await askJSON(JSONschema, metadata);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('\n✅ Done!');
  console.log(`\n✏️  If you need to edit this data, do it in ${chalk.yellow('package.json')}.\n`);
};

module.exports = checkPackage;
