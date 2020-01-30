const chalk = require('chalk');
const getLocaleProp = require('../../../config/utils/getLocaleProp');

module.exports = (locale) => {
  const localeProp = getLocaleProp(locale);
  console.log(chalk`\n{cyan Public URLs for} {green.underline ${locale}}:`);
  console.log(chalk`Embed: {yellow ${localeProp('editions.media.interactive.url')}}`);
  console.log(chalk`Page: {yellow ${localeProp('editions.public.interactive.url')}}\n`);
};
