const chalk = require('chalk');
const profileProp = require('../../../config/utils/getProfileProp');

const desks = ['bengaluru', 'london', 'new-york', 'singapore'];

module.exports = {
  type: 'object',
  properties: {
    reuters: {
      type: 'object',
      properties: {
        desk: {
          type: 'string',
          enum: desks,
          prompt: {
            message: 'What desk is this project publishing from?',
            type: 'select',
            choices: [{
              title: 'Bangalore',
              value: 'bengaluru',
            }, {
              title: 'London',
              value: 'london',
            }, {
              title: 'New York',
              value: 'new-york',
            }, {
              title: 'Singapore',
              value: 'singapore',
            }],
            initial: desks.indexOf(profileProp('desk')),
          },
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
            mask: 'YYYY-MM-DD HH:mm',
            type: 'date',
            initial: () => {
              const date = new Date();
              date.setMinutes(0);
              return date;
            },
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
                  initial: profileProp('name'),
                },
                minLength: 2,
              },
              link: {
                type: 'string',
                format: 'uri',
                prompt: {
                  message: (variablePath) =>
                    `What's a link for the project's author ${chalk.grey(`(${variablePath})`)}?\n`,
                  initial: profileProp('url'),
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
