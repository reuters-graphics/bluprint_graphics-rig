const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  test: /.scss$/,
  include: path.resolve(__dirname, '../../../../src/scss'),
  use: [{
    loader: MiniCssExtractPlugin.loader,
  }, {
    loader: 'css-loader',
    options: {
      sourceMap: true,
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
