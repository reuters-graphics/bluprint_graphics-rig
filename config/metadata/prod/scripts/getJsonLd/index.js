module.exports = (
  seoTitle,
  shareImageSrc
) => ({
  '@context': 'http://schema.org',
  '@type': 'NewsArticle',
  headline: seoTitle,
  url: 'https://graphics.reuters.com/AUSTRALIA-BUSHFIRES-MAP/0100B4TW2NK/',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://graphics.reuters.com/AUSTRALIA-BUSHFIRES-MAP/0100B4TW2NK/',
  },
  thumbnailUrl: 'https://graphics.reuters.com/AUSTRALIA-BUSHFIRES-MAP/0100B4TW2NK/images/share-card.png',
  image: {
    '@type': 'ImageObject',
    url: 'https://graphics.reuters.com/AUSTRALIA-BUSHFIRES-MAP/0100B4TW2NK/images/share-card.png',
    width: '800',
    height: '400',
  },
  dateCreated: 'Will be filled out by gulp publish',
  datePublished: 'Will be filled out by gulp publish',
  dateModified: 'will be filled out by gulp publish',
  author: {
    '@type': 'Person',
    name: 'Marco Hernandez',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Reuters',
    logo: {
      '@type': 'ImageObject',
      url: 'https://s3.reutersmedia.net/resources_v2/images/reuters_social_logo.png',
      width: '200',
      height: '200',
    },
  },
  articleSection: 'Graphics',
  creator: ['Reuters Graphics'],
  keywords: ['Reuters graphics', 'Reuters', 'graphics', 'Interactives'],
});
