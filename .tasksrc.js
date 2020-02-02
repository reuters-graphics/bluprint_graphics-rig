module.exports = {
  scripts: {
    'check:creds': 'npx ./bin/checkCreds/index.js',
    'check:meta': 'npx ./bin/checkMeta/index.js',
    'check:share-img': 'npx ./bin/measureImg/index.js',
    'confirm:meta': 'npx ./bin/confirmMeta/index.js',
    'build:referrals': 'npx ./bin/getReferrals/index.js',
    'build:clean': 'npx ./bin/cleanBuild/index.js',
    'build:packages': 'npx ./bin/buildPackages/index.js',
    'extract-text': 'npx ./bin/extractText/index.js',
    'make-srcset': 'npx ./bin/makeSrcset/index.js',
    'add-locale': 'npx ./bin/addLocale/index.js',
  },
  tasks: {
    start: 'yarn start',
    test: {
      run: 'yarn $1',
    },
    build: {
      run: [
        ['check:meta', { silent: true, locale: '$1' }],
        'build:referrals',
        ['build:clean', { locale: '$1' }],
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.prod.js',
          locale: '$1',
        }],
        ['build:webpack', {
          mode: 'production',
          minify: true,
          config: 'config/webpack.prod.js',
          locale: '$1',
        }],
        ['prettier', {
          write: 'packages/**/source/**/*.{html,css}',
          loglevel: 'warn',
        }],
        ['build:packages', { locale: '$1' }],
        'echo $NODE_ENV',
      ],
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
