const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = {
  test: /\.scss$/,
  include: path.resolve(__dirname, '../../../src/js'),
  use: [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: {
      modules: true,
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
  test: /\.scss$/,
  include: path.resolve(__dirname, '../../../src/js'),
  use: [{
    loader: MiniCssExtractPlugin.loader,
  }, {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: true,
      importLoaders: 1,
    },
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  }],
};

module.exports = { dev, prod };
