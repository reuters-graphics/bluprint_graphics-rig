const del = require('del');
const logger = require('../../config/utils/logger')('Clean build');

logger.info('Cleaning build directories.');
logger.info('📁 dist/');
logger.info('📁 packages/');

del.sync([
  'dist/*',
  'packages/*',
]);

logger.info('✅ Done.\n');
