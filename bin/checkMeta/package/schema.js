const chalk = require('chalk');

module.exports = {
  type: 'object',
  properties: {
    reuters: {
      type: 'object',
      properties: {
        desk: {
          type: 'string',
          enum: ['new york', 'london', 'singapore'],
          prompt: {
            message: 'What desk is this project publishing from?',
            type: 'select',
            choices: [{
              title: 'New York',
              value: 'new york',
            }, {
              title: 'London',
              value: 'london',
            }, {
              title: 'Singapore',
              value: 'singapore',
            }],
            initial: 0,
          },
        },
        workspace: {
          type: 'string',
          pattern: '[a-zA-Z0-9-]+',
        },
        graphicId: {
          type: 'string',
          pattern: '[a-zA-Z0-9-]+',
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
        referrals: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uri',
          },
          maxItems: 4,
        },
      },
      required: ['desk', 'authors', 'referrals', 'publishDate'],
    },
  },
  required: ['reuters'],
};
