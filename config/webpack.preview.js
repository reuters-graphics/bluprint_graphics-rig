const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const chalk = require('chalk');

const common = require('./webpack.common.js');

const AutoprefixerPlugin = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MetataggerPlugin = require('metatagger-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const configureGettext = require('./utils/configureGettext');
const getLocales = require('./utils/getLocales');
const getLocaleMarkdown = require('./utils/getLocaleMarkdown');
const getLocaleData = require('./utils/getLocaleData');
const logger = require('./utils/logger')('Webpack');

const getJsRule = require('./rules/prod/js/react');
const svelteRule = require('./rules/prod/js/svelte');
const scssRule = require('./rules/prod/scss/main');
const scssModuleRule = require('./rules/prod/scss/modules');
const cssRule = require('./rules/prod/css');
const getEjsRenderedRule = require('./rules/prod/ejs/rendered');

const getLocaleMetadata = (locale) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, `../locales/${locale}/metadata.json`)));

module.exports = (env, argv) => getLocales().map((locale) => {
  logger.info(chalk`Building {green.underline ${locale}} ${argv.minify ? 'interactive page' : 'media assets'}...`);

  return (merge(common, {
    entry: {
      app: [
        '@babel/polyfill',
        'whatwg-fetch',
        path.join(__dirname, '../src/js/app.js'),
      ],
      tools: [
        path.join(__dirname, '../src/js/tools/google/publisherTags.js'),
        path.join(__dirname, '../src/js/tools/google/analytics.js'),
        path.join(__dirname, '../src/js/tools/share/index.js'),
      ],
    },
    stats: 'errors-only',
    mode: 'production',
    devtool: argv.minify ? 'source-map' : false,
    output: {
      filename: '[name].[contenthash].js',
      path: argv.minify ?
        path.join(__dirname, '../dist', locale) :
        path.join(__dirname, '../packages', locale, `media-${locale}`, 'media-interactive/source'),
      publicPath: './',
    },
    module: {
      rules: [
        getJsRule(locale),
        svelteRule,
        scssRule,
        scssModuleRule,
        cssRule,
        getEjsRenderedRule({
          lang: locale,
          gt: configureGettext(locale),
          journalize: require('journalize'),
          metadata: Object.assign(
            require('../package.json').reuters,
            getLocaleMetadata(locale)
          ),
          localeMarkdown: getLocaleMarkdown(locale),
          localeData: getLocaleData(locale),
        }),
      ],
    },
    optimization: {
      minimize: !!argv.minify,
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          extractComments: false,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    plugins: [
      AutoprefixerPlugin,
      new HtmlWebpackPlugin({
        filename: 'embed.html',
        template: path.resolve(__dirname, '../src/html/embed.ejs'),
        excludeChunks: ['tools'],
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/html/index.ejs'),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new CopyPlugin([{
        context: path.resolve(__dirname, '../src/static/'),
        from: '**/*',
        to: './',
      }]),
      new MetataggerPlugin({
        tags: {
          head__prepend: require('./metadata/common/head__prepend'),
          head: {
            title: [{ html: 'Preview ONLY!' }],
          },
        },
      }),
    ],
  }));
});
