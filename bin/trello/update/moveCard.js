const authenticateTrello = require('../common/authenticate');
const prompts = require('prompts');

module.exports = async(cardId, boardId) => {
  const trello = authenticateTrello();

  const lists = await trello.getListsOnBoard(boardId);

  const { listId } = await prompts([{
    type: 'select',
    name: 'listId',
    message: 'Which list should we move it to?',
    choices: lists.filter(l => !l.closed).map(({ name, id }) => ({
      title: name,
      value: id,
    })),
  }]);

  await trello.updateCardList(cardId, listId);
};
