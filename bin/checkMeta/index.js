const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const schema = require('./schema');
const difference = require('lodash/difference');
const pick = require('lodash/pick');
const inquirer = require('inquirer');
const chalk = require('chalk');

const YAML_PATH = path.resolve(__dirname, '../../META.yaml');

const tomlFile = fs.readFileSync(YAML_PATH, 'utf8');

const metaData = yaml.parse(tomlFile);

const completedKeys = Object.keys(metaData).filter(k => !!metaData[k]);

const validKeys = completedKeys.filter((key) => {
  const schemaItem = schema[key];
  if (!schemaItem) return false;
  const validation = schemaItem.inquire.validate(metaData[key]);
  return validation === true;
});

const schemaKeys = Object.keys(schema);

const missingKeys = difference(schemaKeys, validKeys);

const neededKeys = missingKeys.filter(key => schema[key].required);

const inquiries = pick(schema, neededKeys);

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

inquirer
  .prompt(Object.keys(inquiries).map((q) => {
    const inquiry = inquiries[q].inquire;
    inquiry.name = q;
    inquiry.message = chalk.yellow(inquiry.message);
    return inquiry;
  }))
  .then(answers => {
    console.log('ANSWERS', answers);
  });

console.log('METADATA', metaData);
console.log('NEEDED', neededKeys);
