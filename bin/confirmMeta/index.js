const getLocales = require('../../config/utils/getLocales');
const confirmLocale = require('./locale');
const confirmPackage = require('./package');

const locales = getLocales();

const confirmMeta = async() => {
  await confirmPackage();

  for (const i in locales) {
    const locale = locales[i];
    await confirmLocale(locale);
  }
};

confirmMeta();
