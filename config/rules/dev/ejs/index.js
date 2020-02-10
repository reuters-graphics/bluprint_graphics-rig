const path = require('path');

module.exports = (data) => ({
  test: /\.ejs$/,
  include: path.resolve(__dirname, '../../../../src/html'),
  use: [{
    loader: 'html-loader',
    options: {
      attrs: false,
      interpolate: true,
    },
  }, {
    loader: path.resolve(__dirname, '../../../loaders/ejs-static-loader/index.js'),
    options: { data },
  }],
});
