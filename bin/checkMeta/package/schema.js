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
      },
      required: ['publishDate'],
    },
  },
  required: ['reuters'],
};
