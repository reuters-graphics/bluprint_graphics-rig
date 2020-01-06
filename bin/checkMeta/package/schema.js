const chalk = require('chalk');

module.exports = {
  type: 'object',
  properties: {
    reuters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri',
        },
        image: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              pattern: '^img\/[a-zA-Z0-9/-]+\.(jpg|png)$',
              prompt: {
                message: (variablePath, invalidMessage) =>
                  !invalidMessage ?
                    'What\'s the relative path to your share image?\n' :
                    'What\'s the relative path to your share image?\n(Should be img/<...>.jpg or img/<...>.png)\n',
                initial: 'img/share.jpg',
              },
            },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
          required: ['path'],
        },
        publishDate: {
          type: 'string',
          format: 'date-time',
          prompt: {
            message: 'When is this piece publishing?',
            mask: 'YYYY-MM-DD HH:mm:ss',
            type: 'date',
            initial: new Date(),
            format: (value) => value.toISOString(),
          },
        },
        updateDate: {
          type: 'string',
          format: 'date-time',
        },
        authors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                prompt: {
                  message: (variablePath) =>
                    `What's the project author's name ${chalk.grey(`(${variablePath})`)}?\n`,
                },
              },
              link: {
                type: 'string',
                format: 'uri',
                prompt: {
                  message: (variablePath) =>
                    `What's a link for the project's author ${chalk.grey(`(${variablePath})`)}?\n`,
                },
              },
            },
            required: ['name', 'link'],
          },
          minItems: 1,
        },
      },
      required: ['image', 'publishDate', 'authors'],
    },
  },
  required: ['reuters'],
};
