const prompts = require('prompts');
const moveCard = require('./moveCard');
const getPkgProp = require('../../../config/utils/getPackageProp');
const logger = require('../../../config/utils/logger')('Trello');

const run = async() => {
  const cardId = getPkgProp('reuters.trello.card');
  const boardId = getPkgProp('reuters.trello.board');

  if (!cardId || !boardId) return;

  const { move } = await prompts({
    type: 'confirm',
    name: 'move',
    message: 'Should we move this project\'s card on the Trello board?',
    initial: false,
  });

  if (move) {
    await moveCard(cardId, boardId);
    logger.info('Moved this project\'s Trello card');
  }
};

run();
