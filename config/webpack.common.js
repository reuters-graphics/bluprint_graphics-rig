const path = require('path');

const { templated: ejsTemplatedRule } = require('./rules/ejs');

module.exports = {
  entry: {
    app: [
      '@babel/polyfill',
      'whatwg-fetch',
      path.join(__dirname, '../src/js/app.js'),
    ],
    tools: [
      path.join(__dirname, '../src/js/tools/index.js'),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.svelte'],
    alias: {
      SCSS: path.resolve(__dirname, '../src/scss'),
      svelte: path.resolve('node_modules', 'svelte'),
    },
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
      ejsTemplatedRule,
    ],
  },
};
