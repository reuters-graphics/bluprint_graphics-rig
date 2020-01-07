const fs = require('fs');
const path = require('path');
const imgSize = require('image-size');
const chalk = require('chalk');
const getLocales = require('../../config/utils/getLocales');

const LOCALES_DIR = path.resolve(__dirname, '../../locales/');
const STATIC_DIR = path.resolve(__dirname, '../../src/static/');

getLocales().forEach((locale) => {
  const filePath = path.resolve(LOCALES_DIR, locale, 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(filePath));

  const imagePath = path.resolve(STATIC_DIR, metadata.image.path);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`\n❗ Can't find share image at: ${chalk.underline.yellow(metadata.image.path)}. \n❗ Update ${chalk.green(`locales/${locale}/metadata.json`)} or be sure the image is at ${chalk.green(`src/static/${metadata.image.path}`)}.\n`);
  }

  const dimensions = imgSize(imagePath);

  metadata.image.width = dimensions.width;
  metadata.image.height = dimensions.height;

  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
});
