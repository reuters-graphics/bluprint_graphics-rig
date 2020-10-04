module.exports = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      pattern: '^[0-9C]{7}',
      prompt: {
        message: 'What\'s your username for publishing to the graphics server?',
      },
    },
    password: {
      type: 'string',
      minLength: 8,
      prompt: {
        message: 'What\'s your password for publishing to the graphics server?',
      },
    },
    apiKey: {
      type: 'string',
      minLength: 10,
      prompt: {
        message: 'What\'s the Sphinx API key for publishing to the graphics server?',
      },
    },
  },
  required: ['username', 'password', 'apiKey'],
};
