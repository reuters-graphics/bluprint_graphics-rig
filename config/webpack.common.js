const path = require('path');

const ejsTemplatedRule = require('./rules/common/ejs');
const csvRule = require('./rules/common/csv');
const mjsRule = require('./rules/common/mjs');
const mdRule = require('./rules/common/md');

module.exports = {
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.svelte'],
    alias: {
      SCSS: path.resolve(__dirname, '../src/scss'),
      Locales: path.resolve(__dirname, '../locales'),
      svelte: path.resolve('node_modules', 'svelte'),
    },
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [ejsTemplatedRule, csvRule, mjsRule, mdRule],
  },
};
