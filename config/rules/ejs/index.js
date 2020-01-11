const path = require('path');

const getRendered = (data) => ({
  test: /\.ejs$/,
  include: path.resolve(__dirname, '../../../src/html'),
  use: [{
    loader: 'html-loader',
    options: {
      attrs: false,
      interpolate: true,
    },
  }, {
    loader: path.resolve(__dirname, '../../loaders/ejs-static-loader/index.js'),
    options: { data },
  }],
});

const templated = {
  test: /\.ejs$/,
  include: path.resolve(__dirname, '../../../src/js'),
  use: {
    loader: path.resolve(__dirname, '../../loaders/ejs-loader/index.js'),
  },
};

module.exports = { getRendered, templated };
