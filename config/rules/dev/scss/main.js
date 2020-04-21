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
      url: false,
    },
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: [
        require('autoprefixer'),
      ],
    },
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  }],
};
