const path = require('path');

module.exports = {
  test: /\.scss$/,
  include: path.resolve(__dirname, '../../../../src/scss'),
  use: [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  }, {
    loader: 'resolve-url-loader',
    options: {},
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  }],
};