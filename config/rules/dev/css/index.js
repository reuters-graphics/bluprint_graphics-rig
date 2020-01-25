module.exports = {
  test: /\.css$/,
  use: [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: { sourceMap: true },
  }],
};
