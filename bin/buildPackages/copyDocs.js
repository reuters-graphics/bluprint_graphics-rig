const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const getLocaleProp = require('../../config/utils/getLocaleProp');

const ROOT = path.resolve(__dirname, '../../');
const README_TEMPLATE = path.join(__dirname, 'docs/README.txt');
const EMBED_TEMPLATE = path.join(__dirname, 'docs/EMBED.html');
const MEDIA_NOTES = path.join(ROOT, 'MEDIA_NOTES.txt');

module.exports = (locale) => {
  const localeProp = getLocaleProp(locale);
  // Embed code
  const url = localeProp('editions.media.interactive.url');

  const embed = fs.readFileSync(EMBED_TEMPLATE, 'utf-8');
  const readme = fs.readFileSync(README_TEMPLATE, 'utf-8');
  const notes = fs.readFileSync(MEDIA_NOTES, 'utf-8');

  const embedCode = `Use the following code to embed this project in your CMS:\n\n${ejs.render(embed, { url })}`;

  const filepath = path.resolve(ROOT, `packages/${locale}/media-interactive/README.txt`);

  fs.writeFileSync(filepath, `${embedCode}\n\n${readme}\n\n${notes}`);
};
