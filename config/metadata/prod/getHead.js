const path = require('path');

module.exports = ({ locale, project }) => ({
  meta: [
    { name: 'description', content: locale.seoDescription },
    // Facebook
    { property: 'fb:app_id', content: '319194411438328' },
    { property: 'fb:admins', content: '616167736' },
    { property: 'fb:admins', content: '625796953' },
    { property: 'fb:admins', content: '571759798' },
    { property: 'og:url', content: locale.editions.public.interactive.url },
    { property: 'og:title', content: locale.shareTitle },
    { property: 'og:description', content: locale.shareDescription },
    {
      property: 'og:image',
      content: path.join(
        locale.editions.public.interactive.url,
        locale.image.path
      ),
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
      content: path.join(
        locale.editions.public.interactive.url,
        locale.image.path
      ),
    },
  ],
  link: [
    { rel: 'canonical', href: locale.editions.public.interactive.url },
    {
      rel: 'shortcut icon',
      href: path.join(
        locale.editions.public.interactive.url,
        'favicon.ico'
      ),
    },
  ],
  title: [
    { html: locale.seoTitle },
  ],
});
