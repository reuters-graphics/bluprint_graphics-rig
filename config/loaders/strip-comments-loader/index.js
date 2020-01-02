const strip = require('strip-comments');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  return strip(source, { keepProtected: true });
};
