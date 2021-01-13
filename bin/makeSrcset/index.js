#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const sharp = require('sharp');
const logger = require('../../config/utils/logger')('Make srcset');
const argv = require('yargs')
  .command('$0 <img>', 'Create an image srcset', (yargs) => {
    yargs.positional('img', {
      describe: `Path to .jpg image file inside ${chalk.yellow('src/static/img')}`,
      type: 'string',
      coerce: (imgPath) => {
        const filePath = imgPath.includes('src/static/img') ?
          path.resolve(process.cwd(), imgPath) :
          path.resolve(process.cwd(), 'src/static/img', imgPath);
        if (!fs.existsSync(filePath)) {
          logger.error(`Can't find img at ${chalk.underline.yellow(imgPath)}.`);
          process.exit(1);
        }
        if (path.extname(filePath) !== '.jpg') {
          logger.error(`Image should be a ${chalk.underline.yellow('.jpg')}.`);
          process.exit(1);
        }
        return filePath;
      },
    })
      .options({
        sizes: {
          alias: 's',
          array: true,
          default: [600, 1200, 2400],
          coerce: (sizes) => sizes.map((size) => {
            if (isNaN(parseInt(size))) {
              logger.error('Sizes hould be integers (representing pixels)');
              process.exit(1);
            }
            return parseInt(size);
          }),
        },
      })
      .help()
      .version();
  }).argv;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const resizeImg = async(filePath, writeDir, width) => {
  return sharp(filePath)
    .resize({ width })
    .jpeg({
      progressive: true,
    })
    .toBuffer()
    .then(data => {
      fs.writeFileSync(path.join(writeDir, `${width}.jpg`), data);
    });
};

const writeMarkup = (pathRoot, widths) => {
  const relativePath = path.relative(path.join(process.cwd(), 'src/static/'), pathRoot);
  const srcset = widths.map(width => `${path.join(relativePath, `${width}.jpg`)} ${width}w`).join(', ');
  const maxSize = Math.max(...widths);
  const markup = `<img srcset="${srcset}" src="${path.join(relativePath, `${maxSize}.jpg`)}" alt="WRITE ME">`;
  fs.writeFileSync(path.join(pathRoot, 'img.html'), markup);
  logger.info('✅ Done.');
  logger.info(`See the images in ${chalk.green(`${relativePath}/...`)}`);
  logger.info(`You can use this markup in your page:\n\n${chalk.green(markup)}\n\n`);
};

const run = async() => {
  logger.info('🖼️  Resizing your image...');
  const dirname = path.basename(argv.img, '.jpg');
  const dir = path.join(process.cwd(), 'src/static/img', dirname);
  ensureDir(dir);
  await Promise.all(argv.sizes.map(async(size) => {
    return resizeImg(argv.img, dir, size);
  }));
  writeMarkup(dir, argv.sizes);
};

run();
