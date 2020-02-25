const path = require('path');
const glob = require('glob');
const archiver = require('archiver');
const logger = require('../../config/utils/logger')('Build packages');

const ROOT = path.resolve(__dirname, '../../');

const makeArchive = (outputStream) => {
  logger.info('Building archive.');
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(outputStream);

  const appFiles = glob.sync('**/*', {
    cwd: ROOT,
    nodir: true,
    ignore: [
      'node_modules/**',
      '.git/**',
      'dist/**', // All built files
      'packages/**',
      'yarn.lock',
      'yarn-error.log',
    ],
  });

  appFiles.forEach(f => archive.file(f, { name: f }));
  archive.finalize();
};

module.exports = makeArchive;
