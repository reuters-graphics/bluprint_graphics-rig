const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  test: /\.svelte$/,
  use: [
    {
      loader: 'svelte-loader',
      options: {
        hydratable: true,
        hotReload: true,
        preprocess: sveltePreprocess({
          scss: true
        }),
      },
    },
  ],
};
