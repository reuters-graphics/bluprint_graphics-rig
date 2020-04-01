module.exports = {
  scripts: {
    // Shortcut for ['npx', ['<cmd>']] ...
    'webpack': 'webpack',
    'prettier': 'prettier',
  },
  tasks: {
    build: {
      run: [
        'build:referrals',
        ['check:meta', { silent: true, locale: '$1' }],
        ['build:clean', { locale: '$1' }],
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.prod.js',
          locale: '$1',
        }],
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.prod.js',
          minify: true,
          locale: '$1',
        }],
        ['prettier', {
          write: 'packages/**/source/**/*.{html,css}',
          loglevel: 'warn',
        }],
        ['build:packages', { locale: '$1' }],
      ],
      env: {
        NODE_ENV: 'production',
      },
    },
    upload: {
      run: [
        ['extract-text', { silent: true }],
        ['check:meta', { locale: '$1' }],
        ['confirm:meta', { locale: '$1' }],
        ['check:share-img', { locale: '$1' }],
        ['graphics-server', { create: true }],
        ['build', ['$1']],
        ['graphics-server', { update: true }],
      ],
    },
    publish: {
      run: [
        ['graphics-server', { publish: true }],
      ],
    },
    preview: {
      run: [
        ['extract-text', { silent: true }],
        // ['check:meta', { locale: '$1' }],
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.preview.js',
          minify: true,
        }],
        'preview-server:local',
      ],
    },
    'preview:aws': {
      run: [
        ['extract-text', { silent: true }],
        // ['check:meta', { locale: '$1' }],
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.preview.js',
          minify: true,
        }],
        'publish:aws',
      ],
    },
  },
};
