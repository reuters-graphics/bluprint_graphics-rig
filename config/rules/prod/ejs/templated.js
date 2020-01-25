const path = require('path');

module.exports = {
  test: /\.ejs$/,
  include: path.resolve(__dirname, '../../../../src/js'),
  use: {
    loader: path.resolve(__dirname, '../../../loaders/ejs-loader/index.js'),
  },
};
