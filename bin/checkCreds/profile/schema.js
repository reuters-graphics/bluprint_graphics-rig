
module.exports = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      prompt: {
        message: 'What\'s your name as you want it to read on your byline?',
      },
    },
    email: {
      type: 'string',
      format: 'email',
      prompt: {
        message: 'What\'s your work email?',
      },
    },
    github: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          prompt: {
            message: 'What\'s your public email on GitHub?',
          },
        },
      },
      required: ['email'],
    },
    url: {
      type: 'string',
      format: 'uri',
      prompt: {
        message: 'What URL would you like associated with your byline, e.g., Twitter profile?',
      },
      initial: 'https://graphics.reuters.com',
    },
    desk: {
      type: 'string',
      enum: ['bengaluru', 'london', 'new york', 'singapore'],
      prompt: {
        message: 'Which graphics desk do you work from?',
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
        initial: 0,
      },
    },
  },
  required: ['name', 'email', 'github', 'url', 'desk'],
};
