const path = require('path');

module.exports = (locale) => ({
  test: /\.js$/,
  use: [{
    loader: path.resolve(__dirname, '../../../loaders/strip-comments-loader/index.js'),
  }, {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: '> 0.5%, not dead, chrome >= 59',
          },
        }],
        '@babel/preset-react',
      ],
      plugins: [
        ['ttag', {
          resolve: {
            translations: path.resolve(__dirname, `../../../../locales/${locale}/messages.ttag.po`),
          },
        }],
        '@babel/proposal-class-properties',
      ],
    },
  }],
});
