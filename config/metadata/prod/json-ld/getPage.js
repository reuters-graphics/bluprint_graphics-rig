const path = require('path');

/**
 * Creates JSON+ld object for page
 * @param  {Object} locale  Metadata from locales/<locale>/metadata.json
 * @param  {Object} project Project's package.json
 * @return {Object}         json+ld object
 */
module.exports = ({ locale, project }) => ({
  '@context': 'http://schema.org',
  '@type': 'NewsArticle',
  headline: locale.seoTitle,
  url: locale.url,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': locale.url,
  },
  thumbnailUrl: path.join(locale.url, locale.image.path),
  image: [{
    '@context': 'http://schema.org',
    '@type': 'ImageObject',
    url: path.join(locale.url, locale.image.path),
    width: locale.image.width,
    height: locale.image.height,
  }],
  publisher: { '@id': 'https://www.reuters.com/#publisher' },
  copyrightHolder: { '@id': 'https://www.reuters.com/#publisher' },
  sourceOrganization: { '@id': 'https://www.reuters.com/#publisher' },
  copyrightYear: new Date().getFullYear(),
  dateCreated: project.reuters.publishDate,
  datePublished: project.reuters.publishDate,
  dateModified: project.reuters.updateDate,
  author: project.reuters.authors.map(({ name, url }) => ({
    '@type': 'Person',
    name,
    url,
  })),
  articleSection: 'Graphics',
  isAccessibleForFree: true,
  creator: ['Reuters Graphics'],
  keywords: ['Reuters graphics', 'Reuters', 'graphics', 'Interactives'],
});
