const checkPackage = require('./package');
const checkLocales = require('./locales');

const checkMeta = async() => {
  await checkPackage();
  await checkLocales();
};

checkMeta();
