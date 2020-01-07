const path = require('path');

const { templated: ejsTemplatedRule } = require('./rules/ejs');

module.exports = {
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
