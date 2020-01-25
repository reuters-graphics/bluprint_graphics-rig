module.exports = {
  test: /\.svelte$/,
  use: [
    {
      loader: 'svelte-loader',
      options: {
        hydratable: true,
        hotReload: true,
      },
    },
  ],
};
