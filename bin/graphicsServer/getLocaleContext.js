const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');
const { serviceUrl, eventsUrl } = require('./constants/locations');

const getLocaleMetadata = (locale) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../locales/${locale}/metadata.json`)));

const getByline = () => pkg.reuters.authors.map(a => a.name).join(', ');

// Make me...
const getSlugline = () => 'USA-ECONOMY/';

module.exports = (locale) => {
  const localeMeta = getLocaleMetadata(locale);
  return {
    eventsUrl,
    serviceUrl,
    site: 'graphics',
    metadata: {
      graphic: {
        title: localeMeta.seoTitle,
        description: localeMeta.seoDescription,
        byline: getByline(),
        slugline: getSlugline(),
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
