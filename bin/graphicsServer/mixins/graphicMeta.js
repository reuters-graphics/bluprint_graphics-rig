const contacts = require('../constants/contacts');

module.exports = {
  getGraphicMeta() {
    return {
      group: 'rngs',
      language: 'en',
      slugline: `${this.getLocaleProp('slugs.root')}/${this.getLocaleProp('slugs.wild')}`,
      title: this.getLocaleProp('seoTitle'),
      description: this.getLocaleProp('seoDescription'),
      byline: this.getPkgProp('reuters.authors').map(d => d.name).join(', '),
      topicCodes: this.topicCodes,
      location: this.location,
      contacts,
    };
  },
};
