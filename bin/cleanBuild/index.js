const del = require('del');
const logger = require('../../config/utils/logger')('Clean build');
const chalk = require('chalk');
const argv = require('yargs').argv;

// Allow limiting build to just one locale
const { locale } = argv;

if (locale && locale !== true) {
  logger.info(chalk`Cleaning {green.underline ${locale}} build directories...`);
  logger.info(`📁 dist/${locale}`);
  logger.info(`📁 packages/${locale}`);

  del.sync([
    `dist/${locale}/*`,
    `packages/${locale}/*`,
  ]);
} else {
  logger.info('Cleaning build directories...');
  logger.info('📁 dist/');
  logger.info('📁 packages/');

  del.sync([
    'dist/*',
    'packages/*',
  ]);
}

logger.info('Resetting log files...');
logger.info('📁 config/logs/');

del.sync([
  'config/logs/*.log',
]);

logger.info('✅ Done.\n');
