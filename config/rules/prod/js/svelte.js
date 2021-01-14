const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  test: /\.svelte$/,
  use: [
    {
      loader: 'svelte-loader',
      options: {
        hydratable: true,
        emitCss: true,
        preprocess: sveltePreprocess({
          scss: true
        }),
      },
    },
  ],
};
