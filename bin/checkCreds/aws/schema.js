module.exports = {
  type: 'object',
  properties: {
    default: {
      type: 'object',
      properties: {
        aws_access_key_id: {
          type: 'string',
          minLength: 10,
        },
        aws_secret_access_key: {
          type: 'string',
          minLength: 10,
        },
      },
      required: ['aws_access_key_id', 'aws_secret_access_key'],
    },
  },
  required: ['default'],
};
