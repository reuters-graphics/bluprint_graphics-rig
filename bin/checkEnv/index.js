const semver = require('semver');
const logger = require('../../config/utils/logger')('Check Environment');

const currentVersion = semver.clean(process.version);

const VALID_VERSIONS = '12.0.0 - 13.9.0';

if (!semver.satisfies(currentVersion, VALID_VERSIONS)) {
  logger.error(`You must use a version of Node between ${VALID_VERSIONS}.`);
  process.exit(1);
}
