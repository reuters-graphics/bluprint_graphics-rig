const path = require('path');
const { readFileSync } = require('fs');
const Gettext = require('node-gettext');
const { po } = require('gettext-parser');

module.exports = (locale) => {
  const gt = new Gettext();
  const gtTranslationsFile = path.resolve(__dirname, `../../../locales/${locale}/messages.gettext.po`);
  const gtTranslationsContent = readFileSync(gtTranslationsFile);
  const parsedTranslations = po.parse(gtTranslationsContent);

  gt.addTranslations(locale, 'messages', parsedTranslations);
  gt.setLocale(locale);
  gt.setTextDomain('messages');
  return gt;
};
