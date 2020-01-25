module.exports = {
  test: /\.svelte$/,
  use: [
    {
      loader: 'svelte-loader',
      options: {
        hydratable: true,
        emitCss: true,
      },
    },
  ],
};
