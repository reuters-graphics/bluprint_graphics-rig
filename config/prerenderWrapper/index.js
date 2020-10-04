const schema = require('./schema');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPrerenderPlugin = require('html-webpack-prerender-plugin');
const findIndex = require('lodash/findIndex');
const Ajv = require('ajv');
const path = require('path');
const fs = require('fs');

const findPluginIndex = (config, filename) =>
  findIndex(config.plugins, plugin => (
    plugin instanceof HtmlWebpackPlugin &&
      plugin.options.filename === filename
  ));

const ROOT = path.resolve(__dirname, '../../');

// This is a wrapper to inject configuration needed for prerendering
// JS apps with html-webpack-prerender-plugin.
module.exports = (config) => {
  if (!fs.existsSync(path.join(ROOT, 'src/js/prerenderedApps.js'))) return config;

  const registeredApps = require('../../src/js/prerenderedApps');

  // Validate registry
  const ajv = new Ajv();
  const valid = ajv.validate(schema, registeredApps);
  if (!valid) throw new Error('Invalid prerender apps config.');

  const isDev = config.mode === 'development';

  registeredApps.forEach((app, i) => {
    const chunkName = `prerendered-app-${i}`;
    const entryPath = path.join(__dirname, '../../src/js/', app.script);
    // Add chunk to the entry array, as leading property
    config.entry = {
      ...{
        [chunkName]: [
          'regenerator-runtime/runtime',
          '@babel/polyfill',
          entryPath,
        ],
      },
      ...config.entry,
    };

    const indexPlugin = findPluginIndex(config, 'index.html');
    const embedPlugin = findPluginIndex(config, 'media-embed.html');

    if (isDev) {
      config.plugins[indexPlugin].options.chunks.push(chunkName);
      config.plugins[embedPlugin].options.chunks.push(chunkName);
      return;
    }

    // Scripts must be isomporhpic!
    config.output.libraryTarget = 'umd';

    // If staticOnly, we exclude chunk from the page
    if (app.staticOnly) {
      config.plugins[indexPlugin].options.excludeChunks.push(chunkName);
      config.plugins[embedPlugin].options.excludeChunks.push(chunkName);
    }

    const pluginConfig = {
      [chunkName]: {
        ...{ selector: app.selector },
        ...(app.pluginOptions || {}),
      },
    };

    config.plugins.push(
      new HtmlWebpackPrerenderPlugin({
        'index.html': pluginConfig,
        'media-embed.html': pluginConfig,
      })
    );
  });

  return config;
};
