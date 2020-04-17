module.exports = {
  scripts: {
    // Shortcut for ['npx', ['<cmd>']] ...
    'webpack': 'webpack',
    'webpack-dev-server': 'webpack-dev-server',
    'prettier': 'prettier',
  },
  tasks: {
    start: {
      run: [
        'check:env',
        ['webpack-dev-server', {
          config: 'config/webpack.dev.js',
        }]
      ]
    },
    build: {
      run: [
        'check:env',
        'build:referrals',
        ['check:meta', { silent: true, locale: '$1' }],
        ['build:clean', { locale: '$1' }],
        'lint:js',
        'lint:scss',
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
        'check:env',
        ['extract-text', { silent: true }],
        ['check:meta', { locale: '$1' }],
        ['confirm:meta', { locale: '$1' }],
        ['check:share-img', { locale: '$1' }],
        ['graphics-server', { create: true }],
        ['build', ['$1']],
        ['graphics-server', { update: true }],
        'repo:commit',
      ],
    },
    publish: {
      run: [
        'check:env',
        ['graphics-server', { publish: true }],
        'trello:update',
      ],
    },
    'preview:build': {
      run: [
        'check:env',
        ['extract-text', { silent: true }],
        ['build:clean'],
        'lint:js',
        'lint:scss',
        ['webpack', {
          mode: 'production',
          config: 'config/webpack.preview.js',
          minify: true,
        }],
      ]
    },
    preview: {
      run: [
        'preview:build',
        'preview-server:local',
      ],
    },
    'preview:aws': {
      run: [
        'preview:build',
        'publish:aws',
      ],
    },
  },
  help: {
    '-- MAIN TASKS -- ': '',
    'start': 'Develop your project',
    'preview': 'Build your project and preview all locales locally',
    'preview:aws': 'Build and publish your preview to AWS',
    'upload': 'Build and upload your project to the graphics server',
    'publish': 'Publish your graphics pack',
    '-- HELPER TASKS -- ': '',
    'add-locale': 'Add a new locale directory to your project',
    'make-srcset': 'Create a responsive image set',
    'extract-text': 'Extract po files from ttag and gt.gettext translations',
    'lint:js': 'Clean up your JS code',
    'lint:scss': 'Clean up your SCSS code'
  }
};
