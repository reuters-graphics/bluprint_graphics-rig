const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const ROOT = path.resolve(__dirname, '../../');

const getLocaleMetadata = (locale) =>
  JSON.parse(fs.readFileSync(path.resolve(ROOT, `locales/${locale}/metadata.json`)));

module.exports = (locale) => {
  // Embed code
  const { url } = getLocaleMetadata(locale);
  const template = fs.readFileSync(path.resolve(__dirname, 'docs/EMBED.html'), 'utf-8');
  const filepath = path.resolve(ROOT, `packages/${locale}/media-${locale}/media-interactive/EMBED.html`);
  fs.writeFileSync(filepath, ejs.render(template, { url }));
  // README
  fs.copyFileSync(
    path.resolve(__dirname, 'docs/README.txt'),
    path.resolve(ROOT, `packages/${locale}/media-${locale}/media-interactive/README.txt`)
  );
};
