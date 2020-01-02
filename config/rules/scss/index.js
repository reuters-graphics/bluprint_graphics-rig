const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = {
  test: /\.scss$/,
  include: path.resolve(__dirname, '../../../src/scss'),
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

const prod = {
  test: /.scss$/,
  include: path.resolve(__dirname, '../../../src/scss'),
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
    },
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  }],
};

module.exports = { dev, prod };
