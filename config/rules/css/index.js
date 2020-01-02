const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = {
  test: /\.css$/,
  use: [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: { sourceMap: true },
  }],
};

const prod = {
  test: /\.css$/,
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
  }],
};

module.exports = { dev, prod };
