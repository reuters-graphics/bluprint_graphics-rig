const INI = require('ini');
const fs = require('fs');
const os = require('os');
const path = require('path');
const askJSON = require('ask-json');
const JSONschema = require('./schema');
const logger = require('../../../config/utils/logger')('Check credentials');

const AWS_DIR = path.join(os.homedir(), '.aws/');

if (!fs.existsSync(AWS_DIR)) fs.mkdirSync(AWS_DIR);

const checkAWS = async() => {
  const filePath = path.resolve(AWS_DIR, 'credentials');

  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '');

  const metadata = INI.parse(fs.readFileSync(filePath, 'utf-8'));

  logger.info('AWS');

  const data = await askJSON(JSONschema, metadata === '' ? {} : metadata);

  fs.writeFileSync(filePath, INI.stringify(data));
};

module.exports = checkAWS;
