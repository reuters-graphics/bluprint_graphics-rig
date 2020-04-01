const fs = require('fs');
const os = require('os');
const path = require('path');
const askJSON = require('ask-json');
const JSONschema = require('./schema');
const logger = require('../../../config/utils/logger')('Check credentials');

const GFX_DIR = path.join(os.homedir(), '.reuters-graphics/');

if (!fs.existsSync(GFX_DIR)) fs.mkdirSync(GFX_DIR);

const checkServer = async() => {
  const filePath = path.resolve(GFX_DIR, 'graphics-server.json');

  const metadata = {};

  logger.info('Graphics server');

  const data = await askJSON(JSONschema, metadata);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = checkServer;
