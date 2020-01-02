const path = require('path');

const dev = {
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: 'last 2 versions',
          },
        }],
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/proposal-class-properties',
      ],
    },
  },
};

const getProd = (locale) => ({
  test: /\.js$/,
  use: [{
    loader: path.resolve(__dirname, '../../loaders/strip-comments-loader/index.js'),
  }, {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: 'last 2 versions',
          },
        }],
        '@babel/preset-react',
      ],
      plugins: [
        ['ttag', {
          resolve: {
            translations: path.resolve(__dirname, `../../../locales/${locale}/messages.ttag.po`),
          },
        }],
        '@babel/proposal-class-properties',
      ],
    },
  }],
});

module.exports = { dev, getProd };
