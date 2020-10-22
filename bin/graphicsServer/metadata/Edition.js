const localePropGetter = require('../../../config/utils/getLocaleProp');
const getPkgProp = require('../../../config/utils/getPackageProp');
const validLocales = require('./validLocales');

class EditionMetadata {
  constructor(locale) {
    const getLocaleProp = localePropGetter(locale);
    this.metadata = {
      // If locale is not on list accepted by Connect, we'll upload as English
      language: validLocales.includes(locale) ? locale : 'en',
      title: getLocaleProp('seoTitle'),
      description: getLocaleProp('seoDescription'),
    };
  }

  setEmbed(embedUrl) {
    const graphicId = getPkgProp('reuters.graphicId');
    if (!graphicId) return;
    const embedId = graphicId.slice(0, 8);
    this.metadata.embed = {
      declaration: `<div id="embed-${embedId}"></div><script type="text/javascript">new pym.Parent("embed-${embedId}", "${embedUrl}", {});</script>`,
      dependencies: '<script type="text/javascript" src="//graphics.thomsonreuters.com/pym.min.js"></script>',
    };
  }
};

module.exports = EditionMetadata;
