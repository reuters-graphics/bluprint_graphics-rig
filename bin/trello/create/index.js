const prompts = require('prompts');
const getExistingCard = require('./getExistingCard');
const createCard = require('./createCard');
const logger = require('../../../config/utils/logger')('Trello');

const run = async() => {
  const { makeCard } = await prompts({
    type: 'confirm',
    name: 'makeCard',
    message: 'Should there be a card in Trello for this project?\n(probably, yes!)',
    initial: true,
  });

  if (!makeCard) return;

  const { hasCard } = await prompts({
    type: 'confirm',
    name: 'hasCard',
    message: 'Do you already have a card in Trello for this project?',
    initial: false,
  });

  if (hasCard) {
    await getExistingCard();
    logger.info('Registered your Trello card for this project');
  } else {
    await createCard();
    logger.info('Created a Trello card for this project');
  }
};

run();
