const getPkgProp = require('../../config/utils/getPackageProp');
const getLocaleProp = require('../../config/utils/getLocaleProp');

module.exports = (locale) => {
  // const localeMeta = getLocaleProp(locale);
  const engMeta = getLocaleProp('en');

  return {
    metadata: {
      graphic: {
        title: engMeta('seoTitle'),
        description: engMeta('seoDescription'),
        byline: getPkgProp('reuters.authors').map(a => a.name).join(', '),
        slugline: `${engMeta('slugs.root')}/${engMeta('slugs.wild')}`,
        languageAbbr: { text: 'en' },
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
