const urljoin = require('url-join');

module.exports = ({ locale, project }) => ({
  meta: [
    { name: 'description', content: locale.seoDescription },
    // Facebook
    { property: 'fb:app_id', content: '319194411438328' },
    { property: 'fb:admins', content: '616167736' },
    { property: 'fb:admins', content: '625796953' },
    { property: 'fb:admins', content: '571759798' },
    { property: 'og:url', content: locale.editions.public.interactive.url },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: locale.shareTitle, itemprop: 'name' },
    { property: 'og:description', content: locale.shareDescription, itemprop: 'description' },
    {
      property: 'og:image',
      content: urljoin(
        locale.editions.public.interactive.url,
        locale.image.path
      ),
      itemprop: 'image',
    },
    { property: 'og:site_name', content: 'Reuters' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ReutersGraphics' },
    { name: 'twitter:creator', content: '@ReutersGraphics' },
    { name: 'twitter:domain', content: 'https://graphics.reuters.com/' },
    { name: 'twitter:title', content: locale.shareTitle },
    { name: 'twitter:description', content: locale.shareDescription },
    {
      name: 'twitter:image:src',
      content: urljoin(
        locale.editions.public.interactive.url,
        locale.image.path
      ),
    },
  ],
  link: [
    { rel: 'canonical', href: locale.editions.public.interactive.url },
    {
      rel: 'shortcut icon',
      href: urljoin(
        locale.editions.public.interactive.url,
        'favicon.ico'
      ),
    },
  ],
  title: [
    { html: locale.seoTitle },
  ],
});
