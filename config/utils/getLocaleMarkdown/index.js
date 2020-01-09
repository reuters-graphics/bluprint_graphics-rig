const md = require('markdown-it')();
const fs = require('fs');
const path = require('path');

const LOCALE_ROOT = path.resolve(__dirname, '../../../locales');

const getLocaleMarkdown = (locale) => (markdownFilePath) => {
  const file = path.join(LOCALE_ROOT, locale, markdownFilePath);
  if (!fs.existsSync(file)) throw new Error(`Can't find markdown file at ${file}`);
  const markdown = fs.readFileSync(file, 'utf-8');
  return md.render(markdown);
};

module.exports = getLocaleMarkdown;
