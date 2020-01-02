const ejs = require('ejs');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  const template = ejs.compile(source, {
    client: true,
    filename: this.resourcePath,
  });

  return 'module.exports = ' + template;
};
