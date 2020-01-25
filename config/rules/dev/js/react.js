module.exports = {
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: 'last 2 versions',
          },
        }],
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/proposal-class-properties',
      ],
    },
  },
};
