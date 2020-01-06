const path = require('path');
const merge = require('webpack-merge');

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

const { getProd: getJsRule } = require('./rules/js/react');
const { prod: svelteRule } = require('./rules/js/svelte');
const { prod: scssRule } = require('./rules/scss');
const { prod: scssModuleRule } = require('./rules/scss/modules');
const { prod: cssRule } = require('./rules/css');
const { getRendered: getEjsRenderedRule } = require('./rules/ejs');

const commonHedMeta = require('./metatags/common/headPre');

const locales = getLocales();

module.exports = (env, argv) => locales.map((locale) =>
  (merge(common, {
    mode: 'production',
    devtool: argv.minify ? 'source-map' : false,
    output: {
      filename: '[name].[contenthash].js',
      path: argv.minify ?
        path.join(__dirname, '../dist', locale) :
        path.join(__dirname, '../packages', locale, 'media-interactive/source'),
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
        }),
      ],
    },
    optimization: {
      minimize: !!argv.minify,
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    plugins: [
      AutoprefixerPlugin,
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/html/index.ejs'),
        chunks: ['app', 'tools'],
      }),
      new HtmlWebpackPlugin({
        filename: 'embed.html',
        template: path.resolve(__dirname, '../src/html/embed.ejs'),
        chunks: ['app'],
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
          head__prepend: commonHedMeta,
        },
      }),
    ],
  })));
