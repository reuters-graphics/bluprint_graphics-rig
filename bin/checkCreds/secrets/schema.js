module.exports = {
  type: 'object',
  properties: {
    trelloApiKey: {
      type: 'string',
      prompt: {
        message: 'Enter the Trello API key:',
      },
    },
    trelloApiToken: {
      type: 'string',
      prompt: {
        message: 'Enter the Trello API token:',
      },
    },
  },
  required: ['trelloApiKey', 'trelloApiToken'],
};
