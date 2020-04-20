const { sheetToData } = require('@newswire/sheet-to-data');
const getAuth = require('./../common/getAuth');
const logger = require('../../../config/utils/logger')('GoogleAPIs');

async function run(spreadsheetId) {
  const auth = await getAuth();
  return sheetToData({ spreadsheetId, auth });
}

module.exports = async(path, spreadsheetId) => {
  const data = await run(spreadsheetId).catch((e) => {
    logger.error(`Error fetching sheet: ${path}`);
  });
  return data;
};
