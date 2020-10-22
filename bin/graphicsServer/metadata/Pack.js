const getPkgProp = require('../../../config/utils/getPackageProp');
const localePropGetter = require('../../../config/utils/getLocaleProp');
const getProfile = require('../utils/getProfile');
const validLocales = require('./validLocales');

class PackMetadata {
  constructor(locale = 'en') {
    this.getLocaleProp = localePropGetter(locale);
    const { email } = getProfile();
    const wildSlug = this.getLocaleProp('slugs.wild');
    this.metadata = {
      // If locale is not on list accepted by Connect, we'll upload as English
      language: validLocales.includes(locale) ? locale : 'en',
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
