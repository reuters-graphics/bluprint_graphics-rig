const { docToArchieML } = require('@newswire/doc-to-archieml');
const getAuth = require('./../common/getAuth');
const logger = require('../../../config/utils/logger')('GoogleAPIs');

async function run(documentId) {
  const auth = await getAuth();
  return docToArchieML({ documentId, auth });
}

module.exports = async(path, documentId) => {
  const data = await run(documentId).catch((e) => {
    logger.error(`Error fetching doc: ${path}`);
  });
  return data;
};
