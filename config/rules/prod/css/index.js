const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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
      plugins: [
        require('autoprefixer'),
      ],
    },
  }],
};
