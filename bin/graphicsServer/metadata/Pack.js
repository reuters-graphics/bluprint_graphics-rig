const getPkgProp = require('../../../config/utils/getPackageProp');
const localePropGetter = require('../../../config/utils/getLocaleProp');
const getProfile = require('../utils/getProfile');

class PackMetadata {
  constructor(locale = 'en') {
    this.getLocaleProp = localePropGetter(locale);
    const { email } = getProfile();
    this.metadata = {
      language: locale,
      rootSlug: this.getLocaleProp('slugs.root'),
      wildSlug: this.getLocaleProp('slugs.wild'),
      desk: getPkgProp('reuters.desk'),
      title: this.getLocaleProp('seoTitle'),
      description: this.getLocaleProp('seoDescription'),
      byline: getPkgProp('reuters.authors')
        .map(a => a.name)
        .join(', '),
      contactEmail: email,
    };
  }
};

module.exports = PackMetadata;
