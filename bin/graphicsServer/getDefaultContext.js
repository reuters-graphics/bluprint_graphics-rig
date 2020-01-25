const getPkgProp = require('../../config/utils/getPackageProp');
const getLocaleProp = require('../../config/utils/getLocaleProp');

module.exports = (locale) => {
  const localeMeta = getLocaleProp(locale);

  return {
    metadata: {
      graphic: {
        title: localeMeta('seoTitle'),
        description: localeMeta('seoDescription'),
        byline: getPkgProp('reuters.authors').map(a => a.name).join(', '),
        slugline: `${localeMeta('slugs.root')}/${localeMeta('slugs.wild')}`,
        languageAbbr: { text: locale },
        topicCodes: [{ mnemonic: 'MTGFX' }],
        tags: [{ text: 'Interactive' }],
        changed: true,
      },
      editions: [
        {
          editionName: 'interactive',
          allowCatalog: true,
          repositories: [
            { repositoryType: 'Public', publish: true },
          ],
        },
        {
          editionName: 'media-interactive',
          allowCatalog: true,
          repositories: [
            { repositoryType: 'Media', publish: false },
          ],
        },
      ],
    },
  };
};
