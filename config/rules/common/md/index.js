const path = require('path');

module.exports = {
  test: /\.md$/,
  use: {
    loader: path.resolve(__dirname, '../../../loaders/md-blocks-loader/index.js'),
  },
};
