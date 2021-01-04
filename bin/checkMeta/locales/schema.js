module.exports = {
  type: 'object',
  properties: {
    slugs: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          pattern: '^[A-Z][A-Z0-9]*-[A-Z0-9]+$',
          minLength: 3,
          prompt: {
            message: 'What\'s the root slug for this locale, i.e., a generic topic slug?',
            format: (text) => text.toUpperCase(),
          },
        },
        wild: {
          type: 'string',
          pattern: '[A-Z\-]*', // eslint-disable-line no-useless-escape
          prompt: {
            message: 'What\'s the wild slug for this locale, i.e., a more specific page slug?',
            format: (text) => text.toUpperCase(),
          },
        },
      },
      required: ['root', 'wild'],
    },
    seoTitle: {
      type: 'string',
      maxLength: 110, // Per Google News SEO guidelines
      prompt: {
        message: 'What\'s the title of this page for search listings (seoTitle)?',
      },
    },
    seoDescription: {
      type: 'string',
      prompt: {
        message: 'What\'s the description of this page for search listings (seoDescription)?',
      },
    },
    shareTitle: {
      type: 'string',
      prompt: {
        message: 'What\'s the title of this page for share cards (shareTitle)?',
      },
    },
    shareDescription: {
      type: 'string',
      prompt: {
        message: 'What\'s the description of this page for share cards (shareDescription)?',
      },
    },
    image: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          pattern: '^img\/[a-zA-Z0-9/_-]+\.(jpg|png)$', // eslint-disable-line no-useless-escape
          prompt: {
            message: 'What\'s the relative path to the share image?',
            initial: 'img/share.png',
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
        interactive: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              format: 'uri',
              prompt: {
                message: 'The interactive page URL should\'ve been filled in automatically from the graphics server, but wasn\'t. Contact a developer.\n',
              },
            },
            embed: {
              type: 'string',
              format: 'uri',
              prompt: {
                message: 'The interactive embed URL should\'ve been filled in automatically from the graphics server, but wasn\'t. Contact a developer.\n',
              },
            },
          },
          required: ['page', 'embed'],
        },
      },
      required: ['interactive'],
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
