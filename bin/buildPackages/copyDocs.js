const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const getLocaleProp = require('../../config/utils/getLocaleProp');

const ROOT = path.resolve(__dirname, '../../');

module.exports = (locale) => {
  const localeProp = getLocaleProp(locale);
  // Embed code
  const url = localeProp('editions.media.interactive.url');
  const template = fs.readFileSync(path.resolve(__dirname, 'docs/EMBED.html'), 'utf-8');
  const filepath = path.resolve(ROOT, `packages/${locale}/media-interactive/EMBED.html`);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, ejs.render(template, { url }));
  // README
  fs.copyFileSync(
    path.resolve(__dirname, 'docs/README.txt'),
    path.resolve(ROOT, `packages/${locale}/media-interactive/README.txt`)
  );
};
