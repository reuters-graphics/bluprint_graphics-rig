const path = require('path');
const portfinder = require('portfinder');
const merge = require('webpack-merge');
const ngrok = require('ngrok');
const open = require('open');

const commonConfig = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MetataggerPlugin = require('metatagger-webpack-plugin');

const getLocaleMarkdown = require('./utils/getLocaleMarkdown');
const getLocaleData = require('./utils/getLocaleData');
const parseMarkdown = require('./utils/parseMarkdown');

const jsRule = require('./rules/dev/js/react');
const svelteRule = require('./rules/dev/js/svelte');
const scssRule = require('./rules/dev/scss/main');
const scssModuleRule = require('./rules/dev/scss/modules');
const cssRule = require('./rules/dev/css');
const getEjsRenderedRule = require('./rules/dev/ejs');
const Prerender = require('./prerenderWrapper');

portfinder.basePort = 3000;

const config = (env, argv, port) => Prerender(merge(commonConfig, {
  entry: {
    app: [
      '@babel/polyfill',
      'whatwg-fetch',
      path.join(__dirname, '../src/js/app.js'),
    ],
    tools: [
      path.join(__dirname, '../src/js/tools/share/index.js'),
      path.join(__dirname, '../src/js/tools/referrals/index.js'),
    ],
    // devtool scripts are only used in development
    devtool_hud: path.resolve(__dirname, '../src/js/tools/dev/hud/index.js'),
    devtool_framer: path.resolve(__dirname, '../src/js/tools/dev/framer/index.js'),
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    disableHostCheck: true,
    port: port,
    open: true,
    hot: true,
    before: function(app, server, compiler) {
      // stolen from here: https://github.com/webpack/webpack-dev-server/issues/1271#issuecomment-360413209
      const watchFiles = ['.html', '.ejs'];

      compiler.hooks.done.tap("html-changed-refresh", (stats) => {
        // don't do anything if there were errors during compilation
        if(stats.hasErrors()) return;

        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);
        const detectHtmlOrEjs = changedFiles.some(filePath =>watchFiles.indexOf(path.parse(filePath).ext) >= 0);

        // if there is an ejs file, then hmr probbaly didn't work. so manually fire add a refresh event
        if(detectHtmlOrEjs) {
          console.log("\nHTML or EJS CHANGED. Firing refresh event.\n");
          server.sockWrite(server.sockets, "content-changed");
        }
      })
    },
    contentBase: [
      path.resolve(__dirname, '../src/static'),
    ],
  },
  module: {
    rules: [
      jsRule,
      svelteRule,
      scssRule,
      scssModuleRule,
      cssRule,
      getEjsRenderedRule({
        gt: { gettext: (name) => name },
        lang: 'en',
        journalize: require('journalize'),
        metadata: Object.assign(
          require('../package.json').reuters,
          require('../locales/en/metadata.json')
        ),
        localeMarkdown: getLocaleMarkdown('en'),
        localeData: getLocaleData('en'),
        parseMarkdown,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/html/index.ejs'),
      chunks: ['app', 'tools', 'devtool_hud'],
    }),
    new HtmlWebpackPlugin({
      filename: 'embed.html',
      template: path.resolve(__dirname, '../src/html/embed.ejs'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'framer.html',
      chunks: ['devtool_framer', 'devtool_hud'],
    }),
    new MetataggerPlugin({
      tags: {
        head__prepend: require('./metadata/common/head__prepend'),
        head: {
          title: [{ html: 'Developing!' }],
        },
      },
    }),
  ],
}));

module.exports = (env, argv) =>
  portfinder.getPortPromise()
    .then(async(port) => {
      // If passing --ngrok, we'll open up a tunnel
      if (argv.ngrok) {
        const url = await ngrok.connect({
          addr: port,
        });
        open(url, { background: true });
      }

      return config(env, argv, port);
    });
