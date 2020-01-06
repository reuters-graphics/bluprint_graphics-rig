module.exports = (
  canonicalHref,
  seoTitle,
  seoDescription,
  shareTitle,
  shareDescription,
  shareImageSrc
) => ({
  meta: [
    { name: 'description', content: seoDescription },
    // Facebook
    { property: 'fb:app_id', content: '319194411438328' },
    { property: 'fb:admins', content: '616167736' },
    { property: 'fb:admins', content: '625796953' },
    { property: 'fb:admins', content: '571759798' },
    { property: 'og:url', content: canonicalHref },
    { property: 'og:title', content: shareTitle },
    { property: 'og:description', content: shareDescription },
    { property: 'og:image', content: shareImageSrc },
    { property: 'og:site_name', content: 'Reuters' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ReutersGraphics' },
    { name: 'twitter:creator', content: '@ReutersGraphics' },
    { name: 'twitter:domain', content: 'https://graphics.reuters.com/' },
    { name: 'twitter:title', content: shareTitle },
    { name: 'twitter:description', content: shareDescription },
    { name: 'twitter:image:src', content: shareImageSrc },
  ],
  link: [
    { rel: 'canonical', href: canonicalHref },
  ],
  title: [
    { html: seoTitle },
  ],
});
