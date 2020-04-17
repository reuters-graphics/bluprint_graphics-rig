const path = require('path');

module.exports = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  include: [
    path.resolve(__dirname, '../../../../node_modules'),
  ],
  use: ['file-loader'],
};
