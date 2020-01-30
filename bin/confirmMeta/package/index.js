const prompts = require('prompts');
const chalk = require('chalk');
const packageProp = require('../../../config/utils/getPackageProp');

module.exports = async(locale) => {
  console.log(chalk`\n\n✏️  Confirm {green.underline pack} metadata:\n`);
  const authors = packageProp('reuters.authors')
    .map(author => `\n  - ${author.name}`).join('');
  console.log(chalk`{cyan Publishing desk}: ${packageProp('reuters.desk')}`);
  console.log(chalk`{cyan Authors}: ${authors}\n\n`);

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Is this metadata correct?',
  });

  if (!confirm) {
    console.log(chalk`\n\n🛑 Stopping...\n\n {green OK}, edit that data in {yellow package.json} under the {yellow.underline reuters} key, then we'll try again!\n\n`);
    process.exit(1);
  }
};
