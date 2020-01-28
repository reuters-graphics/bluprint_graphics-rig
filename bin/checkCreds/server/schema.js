module.exports = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 10,
      pattern: '^api-[a-z0-9]+',
    },
    password: {
      type: 'string',
      minLength: 10,
    },
  },
  required: ['username', 'password'],
};
