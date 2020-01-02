const path = require('path');
const fs = require('fs');
const getLocales = require('../../config/utils/getLocales');
const makeArchive = require('./makeArchive');
const copyLocaleFiles = require('./copyLocale');
const chalk = require('chalk');

const ROOT = path.resolve(__dirname, '../../');

const outputStream = fs.createWriteStream(path.resolve(
  ROOT, 'packages/app.zip'
));

outputStream.on('finish', async() => {
  console.log(chalk.yellow('\n⚙️  Copying locale files.'));
  await Promise.all(
    getLocales().map((locale) => copyLocaleFiles(locale))
  )
    .then(() => {
      console.log('\n');
      fs.unlinkSync('packages/app.zip');
    })
    .catch((e) => console.log(e));
});

makeArchive(outputStream);
