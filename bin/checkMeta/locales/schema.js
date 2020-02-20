module.exports = {
  type: 'object',
  properties: {
    slugs: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          pattern: '[A-Z\-]*', // eslint-disable-line no-useless-escape
          minLength: 3,
          prompt: {
            message: 'What\'s the root slug for this locale, i.e., a generic topic slug?\n',
            format: (text) => text.toUpperCase(),
          },
        },
        wild: {
          type: 'string',
          pattern: '[A-Z\-]*', // eslint-disable-line no-useless-escape
          prompt: {
            message: 'What\'s the wild slug for this locale, i.e., a more specific page slug?\n',
            format: (text) => text.toUpperCase(),
          },
        },
      },
      required: ['root', 'wild'],
    },
    seoTitle: {
      type: 'string',
      maxLength: 110, // Per Google News SEO guidelines
    },
    seoDescription: {
      type: 'string',
    },
    shareTitle: {
      type: 'string',
    },
    shareDescription: {
      type: 'string',
    },
    image: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          pattern: '^img\/[a-zA-Z0-9/_-]+\.(jpg|png)$', // eslint-disable-line no-useless-escape
          prompt: {
            message: (variablePath, invalidMessage) =>
              !invalidMessage ?
                'What\'s the relative path to the share image?\n' :
                'What\'s the relative path to the share image?\n(Should be img/<...>.jpg or img/<...>.png)\n',
            initial: 'img/share.jpg',
          },
        },
        width: { type: 'integer' },
        height: { type: 'integer' },
      },
      required: ['path'],
    },
    editions: {
      type: 'object',
      properties: {
        media: {
          type: 'object',
          properties: {
            interactive: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9/-]+',
                },
                repositoryId: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9/-]+',
                },
                url: {
                  type: 'string',
                  format: 'uri',
                },
              },
              required: ['id', 'repositoryId', 'url'],
            },
            'media-interactive': {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9/-]+',
                },
              },
              required: ['id'],
            },
          },
          required: ['interactive', 'media-interactive'],
        },
        public: {
          type: 'object',
          properties: {
            interactive: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9/-]+',
                },
                repositoryId: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9/-]+',
                },
                url: {
                  type: 'string',
                  format: 'uri',
                },
              },
              required: ['id', 'repositoryId', 'url'],
            },
          },
          required: ['interactive'],
        },
      },
      required: ['media', 'public'],
    },
  },
  required: [
    'slugs',
    'seoTitle',
    'seoDescription',
    'shareTitle',
    'shareDescription',
    'image',
  ],
};
