const fileSchema = {
  type: 'object',
  patternProperties: {
    '^[a-zA-Z]{1}[a-zA-Z0-9_/-]*[a-zA-Z0-9]\.json$': { // eslint-disable-line
      type: 'string',
      pattern: '[a-zA-Z0-9][a-zA-Z0-9_-]*',
      minLength: 40,
    },
  },
  additionalProperties: false,
};

module.exports = {
  type: 'object',
  properties: {
    docs: fileSchema,
    sheets: fileSchema,
  },
};
