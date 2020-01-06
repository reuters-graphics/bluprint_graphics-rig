module.exports = {
  type: 'object',
  properties: {
    seoTitle: {
      type: 'string',
    },
    seoDescription: {
      type: 'string',
    },
    shareTitle: {
      type: 'string',
    },
    shareDescription: {
      type: 'string',
    },
  },
  required: [
    'seoTitle',
    'seoDescription',
    'shareTitle',
    'shareDescription',
  ],
};
