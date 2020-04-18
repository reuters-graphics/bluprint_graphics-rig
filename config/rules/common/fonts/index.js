const path = require('path');

module.exports = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  include: [
    path.resolve(__dirname, '../../../../node_modules'),
  ],
  use: [{
    loader: 'file-loader',
    options: {
      name: 'fonts/[name].[ext]',
    },
  }],
};
