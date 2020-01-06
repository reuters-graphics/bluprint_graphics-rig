const fs = require('fs');
const path = require('path');
const imgSize = require('image-size');
const chalk = require('chalk');

const PACKAGE_DIR = path.resolve(__dirname, '../../');
const STATIC_DIR = path.resolve(__dirname, '../../src/static/');

const filePath = path.resolve(PACKAGE_DIR, 'package.json');
const metadata = JSON.parse(fs.readFileSync(filePath));

const imagePath = path.resolve(STATIC_DIR, metadata.reuters.image.path);

if (!fs.existsSync(imagePath)) {
  throw new Error(`\n❗ Can't find share image at: ${chalk.underline.yellow(metadata.reuters.image.path)}. Update your package.json?\n`);
}

const dimensions = imgSize(imagePath);

metadata.reuters.image.width = dimensions.width;
metadata.reuters.image.height = dimensions.height;

fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
