module.exports = {
  type: 'array',
  items: {
    type: 'object',
    required: ['script', 'selector'],
    properties: {
      script: { type: 'string' },
      selector: { type: 'string' },
      staticOnly: { type: 'boolean' },
      pluginOptions: {
        type: 'object',
        properties: {
          scope: { type: 'object' },
          props: { type: 'object' },
          injectPropsTo: {
            oneOf: [
              { type: 'string' },
              { type: 'boolean' },
            ],
          },
        },
      },
    },
    additionalProperties: false,
  },
};
