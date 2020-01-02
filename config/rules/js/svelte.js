const prod = {
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

const dev = {
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

module.exports = { dev, prod };
