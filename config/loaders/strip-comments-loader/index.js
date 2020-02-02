// const strip = require('strip-comments');
// const logger = require('../../utils/logger')('Webpack');

// Deprecating for now until this bug is resolved:
// https://github.com/jonschlinkert/strip-comments/issues/47
module.exports = function(source) {
  this.cacheable && this.cacheable();
  return source;
  // try {
  //   return strip(source);
  // } catch (e) {
  //   logger.warn('Error stripping comments from client packages. Skipping this step.');
  //   return source;
  // }
};
