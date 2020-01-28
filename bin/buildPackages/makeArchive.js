const path = require('path');
const fs = require('fs');
const glob = require('glob');
const strip = require('strip-comments');
const archiver = require('archiver');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

const makeArchive = (outputStream) => {
  logger.info('Building archive.');
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(outputStream);

  const srcFiles = glob.sync('src/**', {
    cwd: ROOT,
    nodir: true,
    ignore: 'src/static/**',
  });

  srcFiles.forEach((src) => {
    const file = fs.readFileSync(path.resolve(ROOT, src), 'utf8');
    archive.append(strip(file, { keepProtected: true }), { name: src });
  });

  const appFiles = glob.sync('**/*', {
    cwd: ROOT,
    nodir: true,
    ignore: [
      'node_modules/**',
      '.git/**',
      'dist/**', // All built files
      'packages/**',
      '*', // All root level files
    ],
  }).concat(['package.json']);

  appFiles.forEach(f => archive.file(f, { name: f }));
  archive.finalize();
};

module.exports = makeArchive;
