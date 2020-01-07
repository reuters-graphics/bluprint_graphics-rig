module.exports = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '[a-zA-Z0-9-]+',
    },
    url: {
      type: 'string',
      format: 'uri',
    },
    seoTitle: {
      type: 'string',
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
          pattern: '^img\/[a-zA-Z0-9/-]+\.(jpg|png)$', // eslint-disable-line no-useless-escape
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
  },
  required: [
    'id',
    'url',
    'seoTitle',
    'seoDescription',
    'shareTitle',
    'shareDescription',
    'image',
  ],
};
