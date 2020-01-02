const del = require('del');
const chalk = require('chalk');

console.log(
  chalk.yellow('\n\n🧹 Cleaning build directories.'),
  chalk.green('\n\tdist/\n\tpackages/\n\n')
);

del.sync([
  'dist/*',
  'packages/*',
]);
