const chalk = require('chalk');
const profileProp = require('../../../config/utils/getProfileProp');
const fs = require('fs');
const path = require('path');
const ordinal = require('ordinal');
const PACKAGE_DIR = path.resolve(__dirname, '../../../');
const filePath = path.resolve(PACKAGE_DIR, 'package.json');
const metadata = JSON.parse(fs.readFileSync(filePath));

const desks = ['bengaluru', 'london', 'new york', 'singapore'];

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
              value: 'new york',
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
          prompt: {
            message: 'When was this piece updated?',
            mask: 'YYYY-MM-DD HH:mm',
            type: 'date',
            initial: () => {
              const date = new Date();
              date.setMinutes(0);
              return metadata.reuters.updateDate ? new Date(metadata.reuters.updateDate) : date;
            },
            format: (value) => value.toISOString(),
          },
        },
        authors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                prompt: {
                  message: (variablePath) => {
                    const index = parseInt(variablePath.match(/\[(\d+)\]\.name$/)[1]) + 1;
                    return `What's the ${ordinal(index)} author's name ${chalk.grey(`(${variablePath})`)}?`;
                  },
                  initial: profileProp('name'),
                },
                minLength: 2,
              },
              link: {
                type: 'string',
                format: 'uri',
                prompt: {
                  message: (variablePath) => {
                    const index = parseInt(variablePath.match(/\[(\d+)\]\.link$/)[1]) + 1;
                    return `What's a link for the ${ordinal(index)} author ${chalk.grey(`(${variablePath})`)}?`;
                  },
                  initial: profileProp('url'),
                },
              },
            },
            required: ['name', 'link'],
          },
          minItems: 1,
          prompt: {
            addMessage: (dataPath, currentAuthors) => {
              if (currentAuthors.length === 0) return chalk`Would you like to add any additional {green authors}?`;
              const authors = currentAuthors.map(a => a.name).join(', ');
              return chalk`Would you like to add any additional {green authors} (currently ${authors})?`;
            },
          },
        },
        referrals: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uri',
            prompt: {
              message: (dataPath, error) => {
                const index = parseInt(dataPath.match(/\[(\d+)\]$/)[1]) + 1;
                if (error.keyword !== 'type') return `The URL for the ${ordinal(index)} referral link was not valid. What should it be?`;
                return `What's the URL for the ${ordinal(index)} referral link?`;
              },
            },
          },
          maxItems: 4,
          prompt: {
            addMessage: (dataPath, currentLinks) => {
              if (currentLinks.length === 0) return chalk`Would you like to add any custom {green referral links} for the bottom of the page?`;
              return chalk`Would you like to add any additional {green referral links} (currently ${currentLinks.length} added)?`;
            },
          },
        },
      },
      required: ['desk', 'authors', 'referrals', 'publishDate'],
    },
  },
  required: ['reuters'],
};
