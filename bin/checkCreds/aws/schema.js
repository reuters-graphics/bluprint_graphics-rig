module.exports = {
  type: 'object',
  properties: {
    default: {
      type: 'object',
      properties: {
        aws_access_key_id: {
          type: 'string',
          minLength: 10,
          prompt: {
            message: 'What\'s your AWS access key ID for previewing graphics?',
          },
        },
        aws_secret_access_key: {
          type: 'string',
          minLength: 10,
          prompt: {
            message: 'What\'s your AWS secret access key for previewing graphics?',
          },
        },
      },
      required: ['aws_access_key_id', 'aws_secret_access_key'],
    },
  },
  required: ['default'],
};
