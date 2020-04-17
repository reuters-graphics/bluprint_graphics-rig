const authenticateTrello = require('../common/authenticate');
const prompts = require('prompts');
const deskBoards = require('../common/deskBoards');
const setPkgProp = require('../../../config/utils/setPackageProp');

module.exports = async() => {
  const { boardId } = await prompts({
    type: 'select',
    name: 'boardId',
    message: 'Which board is it on?',
    choices: deskBoards,
  });

  const trello = authenticateTrello();

  const cards = await trello.getCardsOnBoard(boardId);

  const { cardId } = await prompts({
    type: 'autocomplete',
    name: 'cardId',
    message: 'Find your card:',
    choices: cards.filter(c => !c.closed).map(({ name, id }) => ({
      title: name,
      value: id,
    })),
  });

  setPkgProp('reuters.trello.card', cardId);
  setPkgProp('reuters.trello.board', boardId);
};
