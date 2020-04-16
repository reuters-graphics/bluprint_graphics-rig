const authenticateTrello = require('../common/authenticate');
const prompts = require('prompts');
const deskBoards = require('../common/deskBoards');
const setPkgProp = require('../../../config/utils/setPackageProp');

module.exports = async() => {
  const { boardId } = await prompts({
    type: 'select',
    name: 'boardId',
    message: 'Which board should we create a card on?',
    choices: deskBoards,
  });

  const trello = authenticateTrello();

  const lists = await trello.getListsOnBoard(boardId);

  const { listId, title, description } = await prompts([{
    type: 'select',
    name: 'listId',
    message: 'Which list should we add it to?',
    choices: lists.filter(l => !l.closed).map(({ name, id }) => ({
      title: name,
      value: id,
    })),
  }, {
    type: 'text',
    name: 'title',
    message: 'What\'s a title for your card?',
  }, {
    type: 'text',
    name: 'description',
    message: 'Add a simple description if you like:',
  }]);

  const card = await trello.addCard(title, description, listId);

  setPkgProp('reuters.trello.card', card.id);
  setPkgProp('reuters.trello.board', boardId);
};
