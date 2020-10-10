const getPkgProp = require('../../../config/utils/getPackageProp');
const localePropGetter = require('../../../config/utils/getLocaleProp');
const getProfile = require('../utils/getProfile');

class PackMetadata {
  constructor(locale = 'en') {
    this.getLocaleProp = localePropGetter(locale);
    const { email } = getProfile();
    const wildSlug = this.getLocaleProp('slugs.wild');
    this.metadata = {
      language: locale,
      rootSlug: this.getLocaleProp('slugs.root'),
      desk: getPkgProp('reuters.desk'),
      title: this.getLocaleProp('seoTitle'),
      description: this.getLocaleProp('seoDescription'),
      byline: getPkgProp('reuters.authors')
        .map(a => a.name)
        .join(', '),
      contactEmail: email,
    };
    if (wildSlug && wildSlug !== '') {
      this.metadata.wildSlug = wildSlug;
    }
  }
};

module.exports = PackMetadata;
