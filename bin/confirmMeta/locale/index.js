const prompts = require('prompts');
const chalk = require('chalk');
const getLocaleProp = require('../../../config/utils/getLocaleProp');

module.exports = async(locale) => {
  const localeProp = getLocaleProp(locale);
  console.log(chalk`\n\n✏️  Confirm {green.underline ${locale}} metadata:`);
  console.log(chalk`\n{green.underline Slugs}`);
  console.log(chalk`{cyan Root}: ${localeProp('slugs.root')}`);
  console.log(chalk`{cyan Wild}: ${localeProp('slugs.wild')}`);
  console.log(chalk`\n{green.underline SEO}`);
  console.log(chalk`{cyan Title}: ${localeProp('seoTitle')}`);
  console.log(chalk`{cyan Description}: ${localeProp('seoDescription')}`);
  console.log(chalk`\n{green.underline Share}`);
  console.log(chalk`{cyan Title}: ${localeProp('shareTitle')}`);
  console.log(chalk`{cyan Description}: ${localeProp('shareDescription')}`);
  console.log(chalk`{cyan Image}: ${localeProp('image.path')}\n\n`);

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Is this metadata correct?',
  });

  if (!confirm) {
    console.log(chalk`\n\n🛑 Stopping...\n\n {green OK}, edit that data in {yellow locales/${locale}/metadata.json}, then we'll try again!\n\n`);
    process.exit(1);
  }
};
